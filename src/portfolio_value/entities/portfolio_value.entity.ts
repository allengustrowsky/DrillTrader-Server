import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { CreatePortfolioValueDto } from '../dto/create-portfolio_value.dto';
import { Portfolio } from '../../portfolio/entities/portfolio.entity';

@Entity()
export class PortfolioValue {
    constructor(createPortfolioValueDto: CreatePortfolioValueDto) {
        this.value = createPortfolioValueDto.value
    }

    @PrimaryKey({
        autoincrement: true,
    })
    readonly id!: number;

    @Property()
    value!: number;

    @Property({
        type: "datetime"
    })
    created_at: Date = new Date()

    @ManyToOne(() => Portfolio, { cascade: [Cascade.REMOVE] })
    portfolio!: Portfolio;
}
