import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Asset } from 'src/asset/entities/asset.entity';
import { PortfolioAsset } from 'src/portfolio_asset/entities/portfolio_asset.entity';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
    constructor(private readonly em: EntityManager) {}

    async create(createTransactionDto: CreateTransactionDto, request: Request) {
        // make sure user can manage portfolio
        const isAuthorized =  createTransactionDto.portfolio_id === (request as any).user.portfolio.id || (request as any).user.is_admin
        if (!isAuthorized) {
            throw new HttpException('You are not allowed to access this portfolio!', HttpStatus.FORBIDDEN);
        }

        // make sure asset is valid
        const validAsset = await this.em.findOne(Asset, createTransactionDto.asset_id)
        if (!validAsset) {
            throw new HttpException(`Asset with id ${createTransactionDto.asset_id} does not exist.`, HttpStatus.NOT_FOUND)
        }

        if (validAsset.name === 'Cash') {
            const transaction = await this.handleCashTransaction(createTransactionDto, validAsset, request)
        }
                

        return 'This action adds a new transaction';
        // return transaction
    }

    findAll(id: number, limit: number) {
        // order by date
        return `This action returns all transaction`;
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

}
