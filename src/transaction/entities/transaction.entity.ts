import { Entity, Cascade, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { create } from 'domain';
import { CreatePortfolioDto } from 'src/portfolio/dto/create-portfolio.dto';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Asset } from '../../asset/entities/asset.entity';
import { Portfolio } from '../../portfolio/entities/portfolio.entity';

@Entity()
export class Transaction {
    constructor(createTransactionDto: CreateTransactionDto) {
        this.units = createTransactionDto.units
        this.is_buy = createTransactionDto.is_buy
    }
    
    @PrimaryKey({
        autoincrement: true,
    })
    readonly id!: number;

    // setting precision and type credit to https://www.kindacode.com/snippet/typeorm-entity-with-decimal-data-type/
    @Property({
        type: 'decimal',
        precision: 10,
        scale: 2
    })
    units!: number;

    // setting precision and type credit to https://www.kindacode.com/snippet/typeorm-entity-with-decimal-data-type/
    @Property({
        type: 'decimal',
        precision: 10,
        scale: 2
    })
    price_per_unit?: number;

    @Property()
    is_buy!: boolean;

    @Property({
        type: "datetime"
    })
    created_at: Date = new Date()

    @ManyToOne(() => Asset, { cascade: [Cascade.PERSIST] })
    asset!: Asset;

    @ManyToOne(() => Portfolio, { cascade: [Cascade.PERSIST] })
    portfolio!: Portfolio;
}
