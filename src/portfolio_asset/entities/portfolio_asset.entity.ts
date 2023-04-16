import { Entity, Cascade, ManyToMany, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { CreatePortfolioAssetDto } from '../dto/create-portfolio_asset.dto';
import { Asset } from '../../asset/entities/asset.entity';
import { Portfolio } from '../../portfolio/entities/portfolio.entity';

@Entity()
export class PortfolioAsset {
    constructor(createPortfolioAssetDto: CreatePortfolioAssetDto) {
        this.units = createPortfolioAssetDto.units ? createPortfolioAssetDto.units : 0
    }

    @PrimaryKey({
        autoincrement: true,
    })
    readonly id!: number;

    @Property()
    units: number = 0;

    @ManyToOne(() => Asset, { cascade: [Cascade.PERSIST] })
    asset!: Asset

    @ManyToOne(() => Portfolio, { cascade: [Cascade.REMOVE] })
    portfolio!: Portfolio
}
