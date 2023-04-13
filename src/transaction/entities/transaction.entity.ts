import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { create } from 'domain';
import { CreatePortfolioDto } from 'src/portfolio/dto/create-portfolio.dto';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Asset } from '../../asset/entities/asset.entity';
import { Portfolio } from '../../portfolio/entities/portfolio.entity';

@Entity()
export class Transaction {
    constructor(createTransactionDto: CreateTransactionDto) {
        this.units = createTransactionDto.units
        this.price = createTransactionDto.price
        this.is_buy = createTransactionDto.is_buy
    }
    
    @PrimaryKey({
        autoincrement: true,
    })
    readonly id!: number;

    @Property()
    units!: number;

    @Property()
    price!: number;

    @Property()
    is_buy!: boolean;

    @Property({
        type: "datetime"
    })
    created_at: Date = new Date()

    @ManyToOne(() => Asset)
    asset!: Asset;

    @ManyToOne(() => Portfolio)
    portfolio!: Portfolio;
}
