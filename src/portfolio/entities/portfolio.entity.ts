import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Portfolio {
    constructor() {}

    @PrimaryKey({
        autoincrement: true,
    })
    readonly id!: number;

    @OneToOne(() => User, user => user.portfolio)
    user!: User;
}
