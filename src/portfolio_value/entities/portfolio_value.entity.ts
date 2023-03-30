import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class PortfolioValue {
    @PrimaryKey({
        autoincrement: true
    })
    readonly id!: number

    // TODO: FK referencing portfolio
    @Property()
    portfolio_id: number

    @Property()
    value!: number

    @Property()
    created_at!: number
}
