import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Transaction {
    @PrimaryKey({
        autoincrement: true
    })
    readonly id!: number

    // TODO: FK referencing portfolio
    @Property()
    portfolio_id!: number

    // TODO: FK referencing asset
    @Property()
    asset_id!: number

    @Property()
    units!: number

    @Property()
    price!: number

    @Property()
    is_buy!: boolean
}
