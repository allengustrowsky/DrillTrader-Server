import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Portfolio {
    @PrimaryKey({
        autoincrement: true
    })
    readonly id!: number

    // TODO: FK referencing user
    @Property()
    user_id: number
}

