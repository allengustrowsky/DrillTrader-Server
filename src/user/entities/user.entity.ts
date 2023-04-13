import { Entity, OneToOne, PrimaryKey, Property, Unique} from '@mikro-orm/core';
import { randomBytes } from 'crypto';
import { create } from 'domain';
import { CreateUserDto } from '../dto/create-user.dto';
import { Portfolio } from '../../portfolio/entities/portfolio.entity';

@Entity()
export class User {
    constructor(createUserDto: CreateUserDto) {
        this.first_name = createUserDto.first_name
        this.last_name = createUserDto.last_name
        this.email_address = createUserDto.email_address
    }

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
        unique: true,
    })
    email_address!: string;

    @Property({
        length: 128,
    })
    // credit: phoenix2010 from https://stackoverflow.com/questions/8855687/secure-random-token-in-node-js
    apiKey = randomBytes(64).toString('hex');

    @Property()
    is_admin?: boolean = false;

    @Property({
        type: "datetime"
    })
    created_at: Date = new Date()

    @OneToOne(() => Portfolio, portfolio => portfolio.user, { owner: true })
    portfolio!: Portfolio;
}
