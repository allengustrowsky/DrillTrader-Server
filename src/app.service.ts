import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user/entities/user.entity';
import { EntityManager } from '@mikro-orm/mysql';
import { Portfolio } from './portfolio/entities/portfolio.entity';
import { Asset } from './asset/entities/asset.entity';
import { AssetType } from './asset_type/entities/asset_type.entity';
import { CreateAssetDto } from './asset/dto/create-asset.dto';
import { PortfolioAsset } from './portfolio_asset/entities/portfolio_asset.entity';
import { Transaction } from './transaction/entities/transaction.entity';
import { LivePriceDataService } from './live_price_data/live_price_data.service';
import { PortfolioValue } from './portfolio_value/entities/portfolio_value.entity';

@Injectable()
export class AppService {
    constructor(private readonly em: EntityManager) {}

    async setup(): Promise<{ adminApiKey: string; nonAdminApiKey: string }> {
        try {
            // add admin user
            const user1 = new User({
                first_name: 'Josh',
                last_name: 'Williams',
                email_address: 'jwilliams@gmail.com',
            });
            user1.is_admin = true;
            await this.em.persistAndFlush(user1);
            const p1 = new Portfolio();
            p1.user = user1;
            await this.em.persistAndFlush(p1);

            // add second user
            const user2 = new User({
                first_name: 'Charissa',
                last_name: 'Jones',
                email_address: 'cjones@gmail.com',
            });
            await this.em.persistAndFlush(user2);
            const p2 = new Portfolio();
            p2.user = user2;
            await this.em.persistAndFlush(p2);

            // add stock asset type
            const a1 = new AssetType({
                name: 'Stock',
            });
            await this.em.persistAndFlush(a1);
            // add cash asset type
            const a2 = new AssetType({
                name: 'Cash',
            });
            await this.em.persistAndFlush(a2);
            // add index fund asset type
            const a3 = new AssetType({
                name: 'Index Fund',
            });
            await this.em.persistAndFlush(a3);
            // add crypto asset type
            const a4 = new AssetType({
                name: 'Cryptocurrency',
            });
            await this.em.persistAndFlush(a4);

            ///////////////////////////////////////////////////
            ///////////////// Add cash asset ////////////////
            ///////////////////////////////////////////////////

            // Cash asset
            const aa3 = new Asset({
                name: 'Cash',
                ticker_symbol: '$',
            });
            aa3.asset_type = a2;
            await this.em.persistAndFlush(aa3);

            ///////////////////////////////////////////////////
            ///////////////// Add stock assets ////////////////
            ///////////////////////////////////////////////////

            // Procter & Gamble Co. (PG)
            const aa4 = new Asset({
                name: 'Procter & Gamble Co.',
                ticker_symbol: 'PG',
            });
            aa4.asset_type = a1;
            await this.em.persistAndFlush(aa4);

            // Mastercard Inc. (MA)
            const aa5 = new Asset({
                name: 'Mastercard Inc.',
                ticker_symbol: 'MA',
            });
            aa5.asset_type = a1;
            await this.em.persistAndFlush(aa5);

            // Amazon.com Inc. (AMZN)
            const aa6 = new Asset({
                name: 'Amazon.com Inc.',
                ticker_symbol: 'AMZN',
            });
            aa6.asset_type = a1;
            await this.em.persistAndFlush(aa6);

            // Microsoft Corporation (MSFT)
            const aa7 = new Asset({
                name: 'Microsoft Corporation',
                ticker_symbol: 'MSFT',
            });
            aa7.asset_type = a1;
            await this.em.persistAndFlush(aa7);

            // Berkshire Hathaway Inc. (BRK.A)
            const aa8 = new Asset({
                name: 'Berkshire Hathaway Inc.',
                ticker_symbol: 'BRK.A',
            });
            aa8.asset_type = a1;
            await this.em.persistAndFlush(aa8);

            // Alphabet Inc. (GOOGL)
            const aa9 = new Asset({
                name: 'Alphabet Inc.',
                ticker_symbol: 'GOOGL',
            });
            aa9.asset_type = a1;
            await this.em.persistAndFlush(aa9);

            // Tesla Inc. (TSLA)
            const aa10 = new Asset({
                name: 'Tesla Inc.',
                ticker_symbol: 'TSLA',
            });
            aa10.asset_type = a1;
            await this.em.persistAndFlush(aa10);

            // Coca-Cola Co. (KO)
            const aa11 = new Asset({
                name: 'Coca-Cola Co.',
                ticker_symbol: 'KO',
            });
            aa11.asset_type = a1;
            await this.em.persistAndFlush(aa11);

            // JPMorgan Chase & Co. (JPM)
            const aa12 = new Asset({
                name: 'JPMorgan Chase & Co.',
                ticker_symbol: 'JPM',
            });
            aa12.asset_type = a1;
            await this.em.persistAndFlush(aa12);

            // Exxon Mobil Corporation (XOM)
            const aa13 = new Asset({
                name: 'Exxon Mobil Corporation',
                ticker_symbol: 'XOM',
            });
            aa13.asset_type = a1;
            await this.em.persistAndFlush(aa13);

            // AAPL stock
            const aa1 = new Asset({
                name: 'Apple Inc.',
                ticker_symbol: 'AAPL',
            });
            aa1.asset_type = a1;
            await this.em.persistAndFlush(aa1);

            ///////////////////////////////////////////////////
            ///////////////// Add index fund assets ///////////
            ///////////////////////////////////////////////////
            const aa14 = new Asset({
                name: 'Vanguard Total Stock Market ETF',
                ticker_symbol: 'VTI',
            });
            aa14.asset_type = a3;
            await this.em.persistAndFlush(aa14);

            // Dow Jones ETF
            const aa15 = new Asset({
                name: 'SPDR Dow Jones Industrial Average ETF Trust',
                ticker_symbol: 'DIA',
            });
            aa15.asset_type = a3;
            await this.em.persistAndFlush(aa15);

            // S&P 500 ETF
            const aa16 = new Asset({
                name: 'SPDR S&P 500 ETF Trust',
                ticker_symbol: 'SPY',
            });
            aa16.asset_type = a3;
            await this.em.persistAndFlush(aa16);

            const aa17 = new Asset({
                name: 'Binance BTCUSDT',
                ticker_symbol: 'BINANCE:BTCUSDT',
            });
            aa17.asset_type = a4;
            await this.em.persistAndFlush(aa17);

            ///////////////////////////////////////////////////
            ///////////////// create portfolio assets ///////////
            ///////////////////////////////////////////////////
            const pa1 = new PortfolioAsset({
                portfolio_id: 2, // p2
                asset_id: 2, //mastercard, aa5
                units: 12.03,
            });
            pa1.portfolio = p2; // user 2
            pa1.asset = aa5; // mastercard
            await this.em.persistAndFlush(pa1);

            const pa2 = new PortfolioAsset({
                portfolio_id: 2, // p2
                asset_id: 8, // KO
                units: 7.91,
            });
            pa2.portfolio = p2; // user 2
            pa2.asset = aa11; // KO
            await this.em.persistAndFlush(pa2);

            const pa3 = new PortfolioAsset({
                portfolio_id: 2, // p2
                asset_id: 8, // KO
                units: 7.91,
            });
            pa3.portfolio = p2; // user 2
            pa3.asset = aa3; // Cash
            await this.em.persistAndFlush(pa3);

            const pa5 = new PortfolioAsset({
                portfolio_id: 2, // p2
                asset_id: 2, //mastercard, aa5
                units: 12.03,
            });
            pa5.portfolio = p1; // user 1
            pa5.asset = aa5; // mastercard
            await this.em.persistAndFlush(pa5);

            const pa6 = new PortfolioAsset({
                portfolio_id: 2, // p2
                asset_id: 8, // KO
                units: 7.91,
            });
            pa6.portfolio = p1; // user 1
            pa6.asset = aa11; // KO
            await this.em.persistAndFlush(pa6);

            const pa4 = new PortfolioAsset({
                portfolio_id: 2, // p2
                asset_id: 8, // KO (ignore)
                units: 7.91,
            });
            pa4.portfolio = p1; // user 1
            pa4.asset = aa3; // Cash
            await this.em.persistAndFlush(pa4);

            const pa7 = new PortfolioAsset({
                portfolio_id: 2, // p2
                asset_id: 8, // KO (ignore)
                units: 13.5,
            });
            pa7.portfolio = p1; // user 1
            pa7.asset = aa7; // Microsoft
            await this.em.persistAndFlush(pa7);

            ///////////////////////////////////////////////////
            ///////////////// create transactions /////////////
            ///////////////////////////////////////////////////
            const t11 = new Transaction({
                portfolio_id: 1, // user1
                asset_id: 2,
                units: 13.5,
                is_buy: true,
            });
            t11.portfolio = p1;
            t11.asset = aa7; //microsoft
            t11.price_per_unit =
                LivePriceDataService.callableAssets['MSFT'].currentPrice;
            await this.em.persistAndFlush(t11);

            const t12 = new Transaction({
                portfolio_id: 1, // user1
                asset_id: 2,
                units: 12.03,
                is_buy: true,
            });
            t12.portfolio = p1;
            t12.asset = aa5; // mastecrard
            t12.price_per_unit =
                LivePriceDataService.callableAssets['MA'].currentPrice;
            await this.em.persistAndFlush(t12);

            const t13 = new Transaction({
                portfolio_id: 1, // user1
                asset_id: 2,
                units: 7.91,
                is_buy: true,
            });
            t13.portfolio = p1;
            t13.asset = aa11; // coca cola
            t13.price_per_unit =
                LivePriceDataService.callableAssets['KO'].currentPrice;
            await this.em.persistAndFlush(t13);

            const t14 = new Transaction({
                portfolio_id: 1, // user1
                asset_id: 2,
                units: 7.91,
                is_buy: false,
            });
            t14.portfolio = p1;
            t14.asset = aa3; // cash
            t14.price_per_unit = 1;
            await this.em.persistAndFlush(t14);

            // User 2 (nonadmin) transactions
            const t15 = new Transaction({
                portfolio_id: 2, // user2
                asset_id: 2,
                units: 12.03,
                is_buy: true,
            });
            t15.portfolio = p2;
            t15.asset = aa5; // mastecrard
            t15.price_per_unit =
                LivePriceDataService.callableAssets['MA'].currentPrice;
            await this.em.persistAndFlush(t15);

            const t16 = new Transaction({
                portfolio_id: 2, // user2
                asset_id: 2,
                units: 7.91,
                is_buy: true,
            });
            t16.portfolio = p2;
            t16.asset = aa11; // coca cola
            t16.price_per_unit =
                LivePriceDataService.callableAssets['KO'].currentPrice;
            await this.em.persistAndFlush(t16);

            const t17 = new Transaction({
                portfolio_id: 2, // user2
                asset_id: 2,
                units: 7.91,
                is_buy: false,
            });
            t17.portfolio = p2;
            t17.asset = aa3; // cash
            t17.price_per_unit = 1;
            await this.em.persistAndFlush(t17);

            ///////////////////////////////////////////////////
            ///////////////// create portfolio values /////////
            ///////////////////////////////////////////////////
            const pv1 = new PortfolioValue({
                portfolio_id: 1,
                value: 6211.1, // fake value, just to have multiple values
            });
            pv1.portfolio = p1; //user1
            this.em.persist(pv1);

            const pv2 = new PortfolioValue({
                portfolio_id: 2,
                value: 4002.21, // fake value, just to have multiple values
            });
            pv2.portfolio = p2; //user2
            this.em.persist(pv2);
            await this.em.flush();

            const pv3 = new PortfolioValue({
                portfolio_id: 1,
                value: 8886.44,
            });
            pv3.portfolio = p1; //user1
            this.em.persist(pv3);

            const pv4 = new PortfolioValue({
                portfolio_id: 2,
                value: 5028.68,
            });
            pv4.portfolio = p2; //user2
            this.em.persist(pv4);
            await this.em.flush();

            return {
                adminApiKey: user1.apiKey,
                nonAdminApiKey: user2.apiKey,
            };
        } catch (e) {
            throw new HttpException(
                `Internal server error during setup: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
