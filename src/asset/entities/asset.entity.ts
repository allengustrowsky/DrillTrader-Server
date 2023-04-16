import { Collection, Cascade, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { CreateAssetDto } from '../dto/create-asset.dto';
import { AssetType } from '../../asset_type/entities/asset_type.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { PortfolioAsset } from '../../portfolio_asset/entities/portfolio_asset.entity';

@Entity()
export class Asset {
    constructor(createAssetDto: CreateAssetDto) {
        this.name = createAssetDto.name
        this.ticker_symbol = createAssetDto.ticker_symbol
    }

    @PrimaryKey({
        autoincrement: true,
    })
    id!: number;

    @Property({
        length: 64,
    })
    name!: string;

    @Property({
        length: 16,
    })
    ticker_symbol!: string;

    @ManyToOne(() => AssetType, { cascade: [Cascade.PERSIST] })
    asset_type?: AssetType;

    @OneToMany(() => Transaction, transaction => transaction.asset)
    transactions = new Collection<Transaction>(this);

    @OneToMany(() => PortfolioAsset, portfolioAsset => portfolioAsset.asset)
    portfolio_assets = new Collection<PortfolioAsset>(this);
}
