import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user/entities/user.entity';
import { EntityManager } from '@mikro-orm/mysql';
import { Portfolio } from './portfolio/entities/portfolio.entity';
import { Asset } from './asset/entities/asset.entity';
import { AssetType } from './asset_type/entities/asset_type.entity';
import { CreateAssetDto } from './asset/dto/create-asset.dto';


@Injectable()
export class AppService {
    constructor(private readonly em: EntityManager) {}

    getHello(): string {
        return 'Hello World!';
    }

    async setup(): Promise<{apiKey: string, nonAdmin: string}> {
        // add admin user
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

        // add second user
        const user2 = new User({
            first_name: "Brandon",
            last_name: "Gustrowsky",
            email_address: "brandon@may21.us"
        })
        await this.em.persistAndFlush(user2);
        const p2 = new Portfolio()
        p2.user = user2;
        await this.em.persistAndFlush(p2)

        // add stock asset type
        const a1 = new AssetType({
            name: "Stock"
        })
        await this.em.persistAndFlush(a1);
        // add cash asset type
        const a2 = new AssetType({
            name: "Cash"
        })
        await this.em.persistAndFlush(a2);
        // add index fund asset type
        const a3 = new AssetType({
            name: "Index Fund"
        })
        await this.em.persistAndFlush(a3);

        ///////////////////////////////////////////////////
        ///////////////// Add cash asset ////////////////
        ///////////////////////////////////////////////////

        // Cash asset
        const aa3 = new Asset({
            name: 'Cash',
            ticker_symbol: '$'
        })
        aa3.asset_type = a2;
        await this.em.persistAndFlush(aa3);

        ///////////////////////////////////////////////////
        ///////////////// Add stock assets ////////////////
        ///////////////////////////////////////////////////

        // Procter & Gamble Co. (PG)
        const aa4 = new Asset({
            name: 'Procter & Gamble Co.', 
            ticker_symbol: 'PG'
        })
        aa4.asset_type = a1;
        await this.em.persistAndFlush(aa4)
        
        // Mastercard Inc. (MA)
        const aa5 = new Asset({
            name: 'Mastercard Inc.', 
            ticker_symbol: 'MA'
        })
        aa5.asset_type = a1;
        await this.em.persistAndFlush(aa5)

        // Amazon.com Inc. (AMZN)
        const aa6 = new Asset({
            name: 'Amazon.com Inc.', 
            ticker_symbol: 'AMZN'
        })
        aa6.asset_type = a1;
        await this.em.persistAndFlush(aa6)

        // Microsoft Corporation (MSFT)
        const aa7 = new Asset({
            name: 'Microsoft Corporation', 
            ticker_symbol: 'MSFT'
        })
        aa7.asset_type = a1;
        await this.em.persistAndFlush(aa7)

        // Berkshire Hathaway Inc. (BRK.A)
        const aa8 = new Asset({
            name: 'Berkshire Hathaway Inc.', 
            ticker_symbol: 'BRK.A'
        })
        aa8.asset_type = a1;
        await this.em.persistAndFlush(aa8)

        // Alphabet Inc. (GOOGL)
        const aa9 = new Asset({
            name: 'Alphabet Inc.', 
            ticker_symbol: 'GOOGL'
        })
        aa9.asset_type = a1;
        await this.em.persistAndFlush(aa9)

        // Tesla Inc. (TSLA)
        const aa10 = new Asset({
            name: 'Tesla Inc.', 
            ticker_symbol: 'TSLA'
        })
        aa10.asset_type = a1;
        await this.em.persistAndFlush(aa10)

        // Coca-Cola Co. (KO)
        const aa11 = new Asset({
            name: 'Coca-Cola Co.', 
            ticker_symbol: 'KO'
        })
        aa11.asset_type = a1;
        await this.em.persistAndFlush(aa11)

        // JPMorgan Chase & Co. (JPM)
        const aa12 = new Asset({
            name: 'JPMorgan Chase & Co.', 
            ticker_symbol: 'JPM'
        })
        aa12.asset_type = a1;
        await this.em.persistAndFlush(aa12)

        // Exxon Mobil Corporation (XOM)
        const aa13 = new Asset({
            name: 'Exxon Mobil Corporation', 
            ticker_symbol: 'XOM'
        })
        aa13.asset_type = a1;
        await this.em.persistAndFlush(aa13)

        // AAPL stock
        const aa1 = new Asset({
            name: 'Apple Inc.', 
            ticker_symbol: 'AAPL'
        })
        aa1.asset_type = a1;
        await this.em.persistAndFlush(aa1)

        ///////////////////////////////////////////////////
        ///////////////// Add index fund assets ///////////
        ///////////////////////////////////////////////////
        const aa14 = new Asset({
            name: 'Vanguard Total Stock Market ETF', 
            ticker_symbol: 'VTI'
        })
        aa14.asset_type = a3;
        await this.em.persistAndFlush(aa14)

        // Dow Jones
        const aa15 = new Asset({
            name: 'SPDR Dow Jones Industrial Average ETF Trust', 
            ticker_symbol: 'DIA'
        })
        aa15.asset_type = a3;
        await this.em.persistAndFlush(aa15)

        // S&P 500
        const aa16 = new Asset({
            name: 'SPDR S&P 500 ETF Trust', 
            ticker_symbol: 'SPY'
        })
        aa16.asset_type = a3;
        await this.em.persistAndFlush(aa16)




        return {
            apiKey: user1.apiKey,
            nonAdmin: user2.apiKey
        }
    }
}
