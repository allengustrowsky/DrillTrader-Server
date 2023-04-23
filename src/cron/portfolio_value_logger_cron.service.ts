import { EntityManager, MikroORM } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Portfolio } from 'src/portfolio/entities/portfolio.entity';
import { LivePriceDataService } from '../live_price_data/live_price_data.service';
import { PortfolioAsset } from 'src/portfolio_asset/entities/portfolio_asset.entity';
import { Asset } from 'src/asset/entities/asset.entity';
import { PortfolioValue } from '../portfolio_value/entities/portfolio_value.entity';

// adapted from nest's article on task scheduling: https://docs.nestjs.com/techniques/task-scheduling
@Injectable()
export class PortfolioValueLogger {
    constructor(private readonly em: EntityManager) {}

    @Cron(CronExpression.EVERY_30_MINUTES)
    async logPortfolioValue() {
        console.log('Cron job starting...');

        let sum = 0;
        const portfolios = await this.em.find(Portfolio, {});
        for (let portfolio of portfolios) {
            // for each portfolio
            const portAssets = await this.em.find(PortfolioAsset, {
                portfolio: portfolio.id,
            });
            for (let idx in portAssets) {
                // for each asset in this portfolio
                let portAsset = portAssets[idx];
                const asset = await this.em.findOne(Asset, portAsset.asset.id); // really inefficient but I just need this to work
                if (!asset) {
                    console.log(
                        `Asset for portfolio asset of id ${portAsset.id} not found.`,
                    );
                } else {
                    console.log(`symbol: ${asset.ticker_symbol}`);
                    console.log(
                        `portAsset id: ${portAsset.id}, units: ${portAsset.units}`,
                    );
                    // sum the assets' values
                    if (asset.name !== 'Cash') {
                        console.log(
                            `${asset.ticker_symbol} live price: ${
                                LivePriceDataService.callableAssets[
                                    asset.ticker_symbol
                                ].currentPrice
                            }`,
                        );
                        sum =
                            sum +
                            +(
                                +portAsset.units *
                                LivePriceDataService.callableAssets[
                                    asset.ticker_symbol
                                ].currentPrice
                            );
                    } else {
                        sum = sum + +portAsset.units;
                    }
                }
            }
            console.log(`portfolio ${portfolio.id} sum: ${sum}`);
            let portValue = new PortfolioValue({
                portfolio_id: portfolio.id,
                value: sum,
            });
            portValue.portfolio = portfolio;
            await this.em.persistAndFlush(portValue);
            sum = 0;
        }
    }
}
