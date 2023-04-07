import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { create } from 'domain';
import { CreatePortfolioDto } from 'src/portfolio/dto/create-portfolio.dto';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Entity()
export class Transaction {
    constructor(createTransactionDto: CreateTransactionDto) {
        this.portfolio_id = createTransactionDto.portfolio_id
        this.asset_id = createTransactionDto.asset_id
        this.units = createTransactionDto.units
        this.price = createTransactionDto.price
        this.is_buy = createTransactionDto.is_buy
    }
    
    @PrimaryKey({
        autoincrement: true,
    })
    readonly id!: number;

    // TODO: FK referencing portfolio
    @Property()
    portfolio_id!: number;

    // TODO: FK referencing asset
    @Property()
    asset_id!: number;

    @Property()
    units!: number;

    @Property()
    price!: number;

    @Property()
    is_buy!: boolean;

    @Property()
    // formatting credit to AlwaysSunny from https://stackoverflow.com/questions/53033014/javascript-remove-milliseconds-from-date-object
    created_at = (new Date).toISOString().split('.')[0]+"Z"
}
