import {
    Cascade,
    Entity,
    ManyToOne,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { CreatePortfolioValueDto } from '../dto/create-portfolio_value.dto';
import { Portfolio } from '../../portfolio/entities/portfolio.entity';

@Entity()
export class PortfolioValue {
    constructor(createPortfolioValueDto: CreatePortfolioValueDto) {
        this.value = createPortfolioValueDto.value;
    }

    @PrimaryKey({
        autoincrement: true,
    })
    readonly id!: number;

    // setting precision and type credit to https://www.kindacode.com/snippet/typeorm-entity-with-decimal-data-type/
    @Property({
        type: 'decimal',
        precision: 16,
        scale: 2,
    })
    value!: number;

    @Property({
        type: 'datetime',
    })
    created_at: Date = new Date();

    @ManyToOne(() => Portfolio, { cascade: [Cascade.REMOVE] })
    portfolio!: Portfolio;
}
