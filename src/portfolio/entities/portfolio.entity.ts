import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';

@Entity()
export class Portfolio {
    constructor(createPortfolioDto: CreatePortfolioDto) {
        this.user_id = createPortfolioDto.user_id
    }

    @PrimaryKey({
        autoincrement: true,
    })
    readonly id!: number;

    // TODO: FK referencing user
    @Property()
    user_id!: number;
}
