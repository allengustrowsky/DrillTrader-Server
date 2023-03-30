import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class AssetType {
    @PrimaryKey({
        autoincrement: true,
    })
    readonly id!: number

    @Property({
        length: 64
    })
    name!: string
}
