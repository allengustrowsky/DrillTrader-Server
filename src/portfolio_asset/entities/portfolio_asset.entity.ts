import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { CreatePortfolioAssetDto } from '../dto/create-portfolio_asset.dto';

@Entity()
export class PortfolioAsset {
    constructor(createPortfolioAssetDto: CreatePortfolioAssetDto) {
        this.porfolio_id = createPortfolioAssetDto.portfolio_id
        this.asset_id = createPortfolioAssetDto.asset_id
        this.units = createPortfolioAssetDto.units ? createPortfolioAssetDto.units : 0
    }

    @PrimaryKey({
        autoincrement: true,
    })
    readonly id!: number;

    // TODO: FK referencing portfolio
    @Property()
    porfolio_id!: number;

    // TODO: FK referencing portfolio
    @Property()
    asset_id!: number;

    @Property()
    units: number = 0;
}
