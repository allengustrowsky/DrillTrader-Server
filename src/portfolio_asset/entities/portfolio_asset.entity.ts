import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class PortfolioAsset {
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
    units!: number;
}
