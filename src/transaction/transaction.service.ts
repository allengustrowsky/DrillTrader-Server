import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Asset } from 'src/asset/entities/asset.entity';
import { PortfolioAsset } from 'src/portfolio_asset/entities/portfolio_asset.entity';
import { Transaction } from './entities/transaction.entity';
import { transcode } from 'buffer';

@Injectable()
export class TransactionService {
    constructor(private readonly em: EntityManager) {}

    async create(createTransactionDto: CreateTransactionDto, request: Request) {
        // make sure user can manage portfolio
        const isAuthorized =  createTransactionDto.portfolio_id === (request as any).user.portfolio.id || (request as any).user.is_admin
        if (!isAuthorized) {
            throw new HttpException('You are not allowed to access this portfolio.', HttpStatus.FORBIDDEN);
        }

        // make sure asset is valid
        const validAsset = await this.em.findOne(Asset, createTransactionDto.asset_id)
        if (!validAsset) {
            throw new HttpException(`Asset with id ${createTransactionDto.asset_id} does not exist.`, HttpStatus.NOT_FOUND)
        }

        // handle cash deposit/widhtrawal
        if (validAsset.name === 'Cash') {
            return await this.handleCashTransaction(createTransactionDto, validAsset, request)
        }

        // make sure user has some cash before transaction
        const cashTemp = await this.em.findOne(Asset, {name: 'Cash'})
        const cashPortAsset = await this.em.findOne(PortfolioAsset, {
            portfolio: (request as any).user.portfolio.id,
            asset: cashTemp?.id
        })
        if (!cashPortAsset) {
            throw new HttpException('No cash for this transaction.', HttpStatus.BAD_REQUEST)
        }

        // handle normal asset buy/sell
        if (createTransactionDto.is_buy) {
            return await this.handleNormalBuy(createTransactionDto, validAsset, cashPortAsset, request)
        } else {
            return await this.handleNormalSell(createTransactionDto, validAsset, cashPortAsset, request)
        }
    }

    async findAllUser(id: number, limit: number, request: Request) {
        // make sure user can manage portfolio
        const isAuthorized = id === (request as any).user.id || (request as any).user.is_admin
        if (!isAuthorized) {
            throw new HttpException('You are not allowed to access this user\' transactions.', HttpStatus.FORBIDDEN);
        }

        return await this.em.find(Transaction, {portfolio: id}, {limit, orderBy: { created_at: 'desc' } })
        // return transactions
    }

    findOne(id: number) {
        return `This action returns a #${id} transaction`;
    }

    update(id: number, updateTransactionDto: UpdateTransactionDto) {
        // ehh, drop this probably.  Why would we need it?
        return `This action updates a #${id} transaction`;
    }

    remove(id: number) {
        // delete transaction, disperse cash back to cash balance
        return `This action removes a #${id} transaction`;
    }

    async handleCashTransaction(createTransactionDto: CreateTransactionDto, cashAsset: Asset, request: Request): Promise<Transaction> {
        const cashPortAsset = await this.em.findOne(PortfolioAsset, {portfolio: createTransactionDto.portfolio_id, asset: cashAsset})

        if (!createTransactionDto.is_buy) { // cash deposit
            if (!cashPortAsset) { // first-time deposit
                // make new cash portfolio asset
                const newCashPortAsset = new PortfolioAsset({
                    portfolio_id: 0,
                    asset_id: 0,
                    units: (+createTransactionDto.units)
                })
                newCashPortAsset.portfolio = (request as any).user.portfolio
                newCashPortAsset.asset = cashAsset
                await this.em.persistAndFlush(newCashPortAsset)
                // create transaction
                const transaction = new Transaction(createTransactionDto)
                transaction.portfolio = (request as any).user.portfolio
                transaction.asset = cashAsset
                transaction.price_per_unit = 1 // 1 because cash
                await this.em.persistAndFlush(transaction)

                return transaction
            } else { // udpate already-existent portoflio asset
                cashPortAsset.units = +cashPortAsset.units + (+createTransactionDto.units)
                await this.em.persistAndFlush(cashPortAsset)
                // create transaction
                const transaction = new Transaction(createTransactionDto)
                transaction.portfolio = (request as any).user.portfolio
                transaction.asset = cashAsset
                transaction.price_per_unit = 1 // 1 because cash
                await this.em.persistAndFlush(transaction)

                return transaction
            }
        } else { // cash withdrawal
            if (!cashPortAsset) {
                throw new HttpException('You have no cash to withdraw.', HttpStatus.BAD_REQUEST)
            } else {
                const enoughMoney = +cashPortAsset.units - (+createTransactionDto.units) >= 0
                if (!enoughMoney) {
                    throw new HttpException('You do not have enough cash to withdraw.', HttpStatus.BAD_REQUEST)
                } else {
                    // update cash portfolio asset
                    cashPortAsset.units = +cashPortAsset.units - (+createTransactionDto.units)
                    await this.em.persistAndFlush(cashPortAsset)
                    // create transaction
                    const transaction = new Transaction(createTransactionDto)
                    transaction.portfolio = (request as any).user.portfolio
                    transaction.asset = cashAsset
                    transaction.price_per_unit = 1
                    await this.em.persistAndFlush(transaction)

                    return transaction
                }
            }
        }
    }

    // reference for finnhub api response:
        // c: Current price
        // d: Change
        // dp: Percent change
        // h: High price of the day
        // l: Low price of the day
        // o: Open price of the day
        // pc: Previous close price

    async handleNormalBuy(createTransactionDto: CreateTransactionDto, validAsset: Asset, cashPortAsset: PortfolioAsset, request: Request): Promise<Transaction> {
        // get live stock data
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${validAsset.ticker_symbol}`, {
            headers: {
                "X-Finnhub-Token": process.env.STOCK_API_KEY || '0'
            }
        })
        const assetData = await response.json()
        if (assetData.error) { // handle rate limit reached
            // credit to ChatGPT for telling me to return a 429 code here
            throw new HttpException('API limit reached. Please wait a for a minute to continue using the API.', HttpStatus.TOO_MANY_REQUESTS)
        }

        const cashRequired = +(assetData.c) * (+createTransactionDto.units)
        if (+cashPortAsset.units < cashRequired) { // user does not have enough cash
            throw new HttpException('You do not have enough cash to make this transaction.', HttpStatus.BAD_REQUEST)
        }

        let portfolioAsset = await this.em.findOne(PortfolioAsset, {
            portfolio: (request as any).user.portfolio.id, 
            asset: createTransactionDto.asset_id
        })
        if (portfolioAsset) { // if portfolio asset exists, update it
            portfolioAsset.units = +portfolioAsset.units + (+createTransactionDto.units)
        } else { // doesn't exist, so initialize one
            portfolioAsset = new PortfolioAsset({
                portfolio_id: 0,
                asset_id: 0,
                units: +createTransactionDto.units
            })
            portfolioAsset.portfolio = (request as any).user.portfolio
            portfolioAsset.asset = validAsset
        }
        cashPortAsset.units = +(cashPortAsset.units) - (+createTransactionDto.units * (+assetData.c))
        const transaction = new Transaction(createTransactionDto)
        transaction.asset = validAsset
        transaction.portfolio = (request as any).user.portfolio
        transaction.price_per_unit = +assetData.c

        this.em.persist(portfolioAsset)
        this.em.persist(cashPortAsset)
        this.em.persist(transaction)
        await this.em.flush()

        return transaction
    }

    async handleNormalSell(createTransactionDto: CreateTransactionDto, validAsset: Asset, cashPortAsset: PortfolioAsset, request: Request): Promise<Transaction> {
        // make sure there are enough portfolio_asset units to sell that
        let portfolioAsset = await this.em.findOne(PortfolioAsset, {
            portfolio: (request as any).user.portfolio.id, 
            asset: createTransactionDto.asset_id
        })
        if (!portfolioAsset) {
            throw new HttpException('You do not have any units of this asset to sell.', HttpStatus.BAD_REQUEST)
        }
        if (+portfolioAsset.units < (+createTransactionDto.units)) {
            throw new HttpException('You do not have enough units of this asset to sell.', HttpStatus.BAD_REQUEST)
        }

        // get live stock data
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${validAsset.ticker_symbol}`, {
            headers: {
                "X-Finnhub-Token": process.env.STOCK_API_KEY || '0'
            }
        })
        const assetData = await response.json()
        if (assetData.error) { // handle rate limit reached
            // credit to ChatGPT for telling me to return a 429 code here
            throw new HttpException('API limit reached. Please wait a for a minute to continue using the API.', HttpStatus.TOO_MANY_REQUESTS)
        }

        portfolioAsset.units = +portfolioAsset.units - (+createTransactionDto.units)
        cashPortAsset.units = +cashPortAsset.units + (+createTransactionDto.units * assetData.c)
        const transaction = new Transaction(createTransactionDto)
        transaction.asset = validAsset
        transaction.portfolio = (request as any).user.portfolio
        transaction.price_per_unit = +assetData.c

        this.em.persist(portfolioAsset)
        this.em.persist(cashPortAsset)
        this.em.persist(transaction)
        await this.em.flush()

        return transaction
    }
}
