import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { randomBytes } from 'crypto';

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
    apiKey = randomBytes(128).toString('hex');

    @Property()
    is_admin?: boolean = false;
}
