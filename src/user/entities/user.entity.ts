import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class User {
    @PrimaryKey({
        autoincrement: true,
    })
    readonly id!: number;

    @Property({
        length: 32,
    })
    first_name!: string;

    @Property({
        length: 32,
    })
    last_name!: string;

    @Property({
        length: 32,
    })
    email_address!: string;

    @Property({
        length: 128,
    })
    apiKey!: string;

    @Property()
    is_admin?: boolean = false;
}
