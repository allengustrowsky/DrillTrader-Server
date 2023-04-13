import { Collection, Entity, OneToMany, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';
import { User } from '../../user/entities/user.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { PortfolioAsset } from '../../portfolio_asset/entities/portfolio_asset.entity';
import { PortfolioValue } from 'src/portfolio_value/entities/portfolio_value.entity';

@Entity()
export class Portfolio {
    constructor() {}

    @PrimaryKey({
        autoincrement: true,
    })
    readonly id!: number;

    @OneToOne(() => User, user => user.portfolio)
    user!: User;

    @OneToMany(() => Transaction, transaction => transaction.portfolio)
    transactions = new Collection<Transaction>(this);

    @OneToMany(() => PortfolioAsset, portfolioAsset => portfolioAsset.portfolio)
    portfolioAssets = new Collection<PortfolioAsset>(this);

    @OneToMany(() => PortfolioValue, portfolioValue => portfolioValue.portfolio)
    portfolioValues = new Collection<PortfolioValue>(this);
}
