import { EntityManager, MikroORM } from "@mikro-orm/mysql";
import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Portfolio } from "src/portfolio/entities/portfolio.entity";
import { LivePriceDataService } from "../live_price_data/live_price_data.service";
import { PortfolioAsset } from "src/portfolio_asset/entities/portfolio_asset.entity";
import { Asset } from "src/asset/entities/asset.entity";
import { PortfolioValue } from "../portfolio_value/entities/portfolio_value.entity";

// adapted from nest's article on task scheduling: https://docs.nestjs.com/techniques/task-scheduling
@Injectable()
export class PortfolioValueLogger {
    // private readonly em: EntityManager
    constructor(private readonly em: EntityManager) {
        // em = this.em.fork()
    }
    // constructor(@InjectMikroORM('') private readonly orm: MikroORM,
                // @InjectEntityManager('') private readonly em: EntityManager) {}
    // constructor(em: EntityManager) {
        
        // @InjectEntityManager() this.em = em
        // @InjectEntityManager('db1') this.em = em
    // }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async logPortfolioValue() {
        // const portfolios = await this.em.find(Portfolio, {}) // having problems with this
        console.log('cron job running! eyyyyyy')
        // this.logData()
        
        let sum = 0
        const portfolios = await this.em.find(Portfolio, {})
        for (let portfolio of portfolios) {
            const portAssets = await this.em.find(PortfolioAsset, {portfolio: portfolio.id})
            // console.dir(portAssets)
            // console.dir(portAssets[0])
            for (let idx in portAssets) {
                let portAsset = portAssets[idx]
                // console.log('portAsset')
                // console.dir(portAsset)
                // console.dir(portAsset.asset)
                
                const asset = await this.em.findOne(Asset, portAsset.asset.id) // really inefficient but I just need this to work
                if (!asset) {
                    console.log(`Asset for portfolio asset of id ${portAsset.id} not found.`)
                } else {

                // console.log('daatobj:')
                // console.dir(LivePriceDataService.callableAssets[portAsset.asset.ticker_symbol])
                // console.log(`symbol: ${portAsset.asset.ticker_symbol}`)
                    // console.dir(asset)
                    console.log(`symbol: ${asset.ticker_symbol}`)
                    console.log(`portAsset id: ${portAsset.id}, units: ${portAsset.units}`)
                    if (asset.name !== 'Cash') {
                        console.log(`${asset.ticker_symbol} live price: ${LivePriceDataService.callableAssets[asset.ticker_symbol].currentPrice}`)
                        sum = sum + +(+portAsset.units * LivePriceDataService.callableAssets[asset.ticker_symbol].currentPrice)
                    } else {
                        sum = sum + (+portAsset.units)
                    }
                    
                }

            }
            console.log(`portfolio ${portfolio.id} sum: ${sum}`)
            let portValue = new PortfolioValue({
                portfolio_id: portfolio.id,
                value: sum
            })
            portValue.portfolio = portfolio
            await this.em.persistAndFlush(portValue)
            sum = 0
        }
        // for each portfolio
            // get all portfolio assets in that portfolio
            // for each portfolio asset
                // sum = p_asset.units * p_asset.

        // cash portfolio asset handle differently
        // if this cannot be handled with web sockets, then put use limit is reached by finnhub api rate limits bc have to 
        // time out until rate limit refills
    }

    logData(): boolean {
        console.log('live price data: ')
        console.dir(LivePriceDataService.callableAssets)
        return true;
    }
}