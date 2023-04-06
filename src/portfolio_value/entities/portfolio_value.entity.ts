import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { CreatePortfolioValueDto } from '../dto/create-portfolio_value.dto';

@Entity()
export class PortfolioValue {
    constructor(createPortfolioValueDto: CreatePortfolioValueDto) {
        this.portfolio_id = createPortfolioValueDto.portfolio_id
        this.value = createPortfolioValueDto.value
    }

    @PrimaryKey({
        autoincrement: true,
    })
    readonly id!: number;

    // TODO: FK referencing portfolio
    @Property()
    portfolio_id!: number;

    @Property()
    value!: number;

    // received from client in unix time and stored in unix time
    @Property()
    created_at!: number;
}
