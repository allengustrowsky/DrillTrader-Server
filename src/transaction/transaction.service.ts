import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Asset } from 'src/asset/entities/asset.entity';
import { PortfolioAsset } from 'src/portfolio_asset/entities/portfolio_asset.entity';
import { Transaction } from './entities/transaction.entity';
import { transcode } from 'buffer';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TransactionService {
    constructor(private readonly em: EntityManager) {}

    async create(createTransactionDto: CreateTransactionDto, request: Request) {
        // make sure user can manage portfolio
        const isAuthorized =
            createTransactionDto.portfolio_id ===
                (request as any).user.portfolio.id ||
            (request as any).user.is_admin;
        if (!isAuthorized) {
            throw new HttpException(
                'You are not allowed to access this portfolio.',
                HttpStatus.FORBIDDEN,
            );
        }

        // make sure asset is valid
        const validAsset = await this.em.findOne(
            Asset,
            createTransactionDto.asset_id,
        );
        if (!validAsset) {
            throw new HttpException(
                `Asset with id ${createTransactionDto.asset_id} does not exist.`,
                HttpStatus.NOT_FOUND,
            );
        }

        // handle cash deposit/widhtrawal
        if (validAsset.name === 'Cash') {
            return await this.handleCashTransaction(
                createTransactionDto,
                validAsset,
                request,
            );
        }

        // make sure user has some cash before transaction
        const cashTemp = await this.em.findOne(Asset, { name: 'Cash' });
        const cashPortAsset = await this.em.findOne(PortfolioAsset, {
            portfolio: (request as any).user.portfolio.id,
            asset: cashTemp?.id,
        });
        if (!cashPortAsset) {
            throw new HttpException(
                'No cash for this transaction.',
                HttpStatus.BAD_REQUEST,
            );
        }

        // handle normal asset buy/sell
        if (createTransactionDto.is_buy) {
            return await this.handleNormalBuy(
                createTransactionDto,
                validAsset,
                cashPortAsset,
                request,
            );
        } else {
            return await this.handleNormalSell(
                createTransactionDto,
                validAsset,
                cashPortAsset,
                request,
            );
        }
    }

    async findAllUser(id: number, limit: number, request: Request) {
        // make sure user can manage portfolio
        // need to not compare by portfolio id bc doesn't work with more than a few users and some deleting
        // const isAuthorized =
        //     id === (request as any).user.id || (request as any).user.is_admin;
        // if (!isAuthorized) {
        //     throw new HttpException(
        //         "You are not allowed to access this user' transactions.",
        //         HttpStatus.FORBIDDEN,
        //     );
        // }

        const user = await this.em.findOne(User, id);
        if (!user) {
            throw new HttpException(`User with id ${id} not found!`, HttpStatus.NOT_FOUND);
        }

        return await this.em.find(
            Transaction,
            { portfolio: user.portfolio },
            { populate: ['asset'], limit, orderBy: { created_at: 'desc' } },
        );
        // return transactions
    }

    async findOne(id: number, request: Request) {
        const transaction = await this.em.findOne(Transaction, id, { populate: ['asset'] });
        if (!transaction) {
            throw new HttpException(
                `Transaction with id ${id} not found.`,
                HttpStatus.NOT_FOUND,
            );
        }

        // make sure user can manage portfolio
        const isAuthorized =
            transaction.portfolio.id === (request as any).user.portfolio.id ||
            (request as any).user.is_admin;
        if (!isAuthorized) {
            throw new HttpException(
                "You are not allowed to access this user' transactions.",
                HttpStatus.FORBIDDEN,
            );
        }

        return transaction;
    }

    // update(id: number, updateTransactionDto: UpdateTransactionDto) {
    //     return `This action updates a #${id} transaction`;
    // }

    // Note: this method should work for deleting buy, non-cash transactions.  However,
    // if the transaction was a sell or was a cash transaction, it may not work properly.
    // Due to the complexity if implementing this method and the amount of use it would
    // receive, it has been disabled.
    // async remove(id: number) {
    //     // delete transaction, disperse cash back to cash balance
    //     const transaction = await this.em.findOne(Transaction, id);
    //     if (!transaction) {
    //         throw new HttpException(`Transaction with id ${id} not found.`, HttpStatus.NOT_FOUND)
    //     }

    //     // increase user's cash balance
    //     const cashAsset = await this.em.findOne(Asset, {name: 'Cash'})
    //     if (!cashAsset) {
    //         throw new HttpException('If you are reading this message as a client then something really bad happened.', HttpStatus.INTERNAL_SERVER_ERROR)
    //     }
    //     // (need cash portfolio_asset)
    //     const cashPortAsset = await this.em.findOne(PortfolioAsset, {portfolio: transaction.portfolio.id, asset: cashAsset.id})
    //     if (!cashPortAsset) {
    //         throw new HttpException('User has not deposited any cash onto their account, so this transaction cannot be deleted.', HttpStatus.BAD_REQUEST)
    //     }
    //     cashPortAsset.units = +cashPortAsset.units + (+transaction.units * +(transaction.price_per_unit ?? 1))

    //     // decrease portoflio asset of this type
    //     const delPortAsset = await this.em.findOne(PortfolioAsset, {asset: transaction.asset.id})
    //     if (!delPortAsset) {
    //         throw new HttpException('User has does not have any record of owning this asset, so this transaction cannot be deleted.', HttpStatus.BAD_REQUEST)
    //     }
    //     // make sure units don't go below 0.
    //     const newUnits = +delPortAsset.units - (+transaction.units)
    //     if (newUnits < 0) {
    //         throw new HttpException(`You do not have enough of the ${delPortAsset.asset.name} to be fully refunded for this transaction, so it cannot be deleted.`, HttpStatus.CONFLICT)
    //     }
    //     delPortAsset.units = newUnits;

    //     this.em.remove(transaction)
    //     this.em.persist(cashPortAsset)
    //     this.em.persist(delPortAsset)
    //     this.em.flush()

    //     return transaction
    // }

    async handleCashTransaction(
        createTransactionDto: CreateTransactionDto,
        cashAsset: Asset,
        request: Request,
    ): Promise<Transaction> {
        const cashPortAsset = await this.em.findOne(PortfolioAsset, {
            portfolio: createTransactionDto.portfolio_id,
            asset: cashAsset,
        });

        if (!createTransactionDto.is_buy) {
            // cash deposit
            if (!cashPortAsset) {
                // first-time deposit
                // make new cash portfolio asset
                const newCashPortAsset = new PortfolioAsset({
                    portfolio_id: 0,
                    asset_id: 0,
                    units: +createTransactionDto.units,
                });
                newCashPortAsset.portfolio = (request as any).user.portfolio;
                newCashPortAsset.asset = cashAsset;
                await this.em.persistAndFlush(newCashPortAsset);
                // create transaction
                const transaction = new Transaction(createTransactionDto);
                transaction.portfolio = (request as any).user.portfolio;
                transaction.asset = cashAsset;
                transaction.price_per_unit = 1; // 1 because cash
                await this.em.persistAndFlush(transaction);

                return transaction;
            } else {
                // udpate already-existent portoflio asset
                cashPortAsset.units =
                    +cashPortAsset.units + +createTransactionDto.units;
                await this.em.persistAndFlush(cashPortAsset);
                // create transaction
                const transaction = new Transaction(createTransactionDto);
                transaction.portfolio = (request as any).user.portfolio;
                transaction.asset = cashAsset;
                transaction.price_per_unit = 1; // 1 because cash
                await this.em.persistAndFlush(transaction);

                return transaction;
            }
        } else {
            // cash withdrawal
            if (!cashPortAsset) {
                throw new HttpException(
                    'You have no cash to withdraw.',
                    HttpStatus.BAD_REQUEST,
                );
            } else {
                const enoughMoney =
                    +cashPortAsset.units - +createTransactionDto.units >= 0;
                if (!enoughMoney) {
                    throw new HttpException(
                        'You do not have enough cash to withdraw.',
                        HttpStatus.BAD_REQUEST,
                    );
                } else {
                    // update cash portfolio asset
                    cashPortAsset.units =
                        +cashPortAsset.units - +createTransactionDto.units;
                    await this.em.persistAndFlush(cashPortAsset);
                    // create transaction
                    const transaction = new Transaction(createTransactionDto);
                    transaction.portfolio = (request as any).user.portfolio;
                    transaction.asset = cashAsset;
                    transaction.price_per_unit = 1;
                    await this.em.persistAndFlush(transaction);

                    return transaction;
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

    async handleNormalBuy(
        createTransactionDto: CreateTransactionDto,
        validAsset: Asset,
        cashPortAsset: PortfolioAsset,
        request: Request,
    ): Promise<Transaction> {
        // get live stock data
        const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${validAsset.ticker_symbol}`,
            {
                headers: {
                    'X-Finnhub-Token': process.env.STOCK_API_KEY || '0',
                },
            },
        );
        const assetData = await response.json();
        if (assetData.error) {
            // handle rate limit reached
            // credit to ChatGPT for telling me to return a 429 code here
            throw new HttpException(
                'API limit reached. Please wait a for a minute to continue using the API.',
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        const cashRequired = +assetData.c * +createTransactionDto.units;
        if (+cashPortAsset.units < cashRequired) {
            // user does not have enough cash
            throw new HttpException(
                'You do not have enough cash to make this transaction.',
                HttpStatus.BAD_REQUEST,
            );
        }

        let portfolioAsset = await this.em.findOne(PortfolioAsset, {
            portfolio: (request as any).user.portfolio.id,
            asset: createTransactionDto.asset_id,
        });
        if (portfolioAsset) {
            // if portfolio asset exists, update it
            portfolioAsset.units =
                +portfolioAsset.units + +createTransactionDto.units;
        } else {
            // doesn't exist, so initialize one
            portfolioAsset = new PortfolioAsset({
                portfolio_id: 0,
                asset_id: 0,
                units: +createTransactionDto.units,
            });
            portfolioAsset.portfolio = (request as any).user.portfolio;
            portfolioAsset.asset = validAsset;
        }
        cashPortAsset.units =
            +cashPortAsset.units - +createTransactionDto.units * +assetData.c;
        const transaction = new Transaction(createTransactionDto);
        transaction.asset = validAsset;
        transaction.portfolio = (request as any).user.portfolio;
        transaction.price_per_unit = +assetData.c;

        this.em.persist(portfolioAsset);
        this.em.persist(cashPortAsset);
        this.em.persist(transaction);
        await this.em.flush();

        return transaction;
    }

    async handleNormalSell(
        createTransactionDto: CreateTransactionDto,
        validAsset: Asset,
        cashPortAsset: PortfolioAsset,
        request: Request,
    ): Promise<Transaction> {
        // make sure there are enough portfolio_asset units to sell that
        let portfolioAsset = await this.em.findOne(PortfolioAsset, {
            portfolio: (request as any).user.portfolio.id,
            asset: createTransactionDto.asset_id,
        });
        if (!portfolioAsset) {
            throw new HttpException(
                'You do not have any units of this asset to sell.',
                HttpStatus.BAD_REQUEST,
            );
        }
        if (+portfolioAsset.units < +createTransactionDto.units) {
            throw new HttpException(
                'You do not have enough units of this asset to sell.',
                HttpStatus.BAD_REQUEST,
            );
        }

        // get live stock data
        const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${validAsset.ticker_symbol}`,
            {
                headers: {
                    'X-Finnhub-Token': process.env.STOCK_API_KEY || '0',
                },
            },
        );
        const assetData = await response.json();
        if (assetData.error) {
            // handle rate limit reached
            // credit to ChatGPT for telling me to return a 429 code here
            throw new HttpException(
                'API limit reached. Please wait a for a minute to continue using the API.',
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        portfolioAsset.units =
            +portfolioAsset.units - +createTransactionDto.units;
        cashPortAsset.units =
            +cashPortAsset.units + +createTransactionDto.units * assetData.c;
        const transaction = new Transaction(createTransactionDto);
        transaction.asset = validAsset;
        transaction.portfolio = (request as any).user.portfolio;
        transaction.price_per_unit = +assetData.c;

        this.em.persist(portfolioAsset);
        this.em.persist(cashPortAsset);
        this.em.persist(transaction);
        await this.em.flush();

        return transaction;
    }
}
