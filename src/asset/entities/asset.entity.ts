import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Asset {
    @PrimaryKey({
        autoincrement: true,
    })
    id!: number

    @Property({
        length: 64,
    })
    name!: string

    // TODO: make foreign key
    @Property()
    asset_type_id: number

    @Property({
        length: 16,
    })
    ticker_symbol!: string
}
