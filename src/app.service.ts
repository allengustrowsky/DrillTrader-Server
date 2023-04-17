import { Injectable } from '@nestjs/common';
import { User } from './user/entities/user.entity';
import { EntityManager } from '@mikro-orm/mysql';
import { Portfolio } from './portfolio/entities/portfolio.entity';
import { Asset } from './asset/entities/asset.entity';
import { AssetType } from './asset_type/entities/asset_type.entity';

@Injectable()
export class AppService {
    constructor(private readonly em: EntityManager) {}

    getHello(): string {
        return 'Hello World!';
    }

    async setup(): Promise<{apiKey: string, nonAdmin: string}> {
        const user1 = new User({
            first_name: "Allen",
            last_name: "Gustrowsky",
            email_address: "allen@may21.us"
        })
        user1.is_admin = true;
        await this.em.persistAndFlush(user1);
        const p1 = new Portfolio()
        p1.user = user1;
        await this.em.persistAndFlush(p1)

        const user2 = new User({
            first_name: "Brandon",
            last_name: "Gustrowsky",
            email_address: "brandon@may21.us"
        })
        await this.em.persistAndFlush(user2);
        const p2 = new Portfolio()
        p2.user = user2;
        await this.em.persistAndFlush(p2)

        const a1 = new AssetType({
            name: "Stock"
        })
        await this.em.persistAndFlush(a1);

        return {
            apiKey: user1.apiKey,
            nonAdmin: user2.apiKey
        }
    }
}
