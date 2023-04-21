import { EntityManager } from "@mikro-orm/mysql";
import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Portfolio } from "src/portfolio/entities/portfolio.entity";

// adapted from nest's article on task scheduling: https://docs.nestjs.com/techniques/task-scheduling
@Injectable()
export class PortfolioValueLogger {
    constructor(private readonly em: EntityManager) {}

    @Cron(CronExpression.EVERY_10_SECONDS)
    async logPortfolioValue() {
        const portfolios = await this.em.find(Portfolio, {})
        console.log('cron job running! eyyyyyy')
        
        // for each portfolio
            // get all portfolio assets in that portfolio
            // for each portfolio asset
                // sum = p_asset.units * p_asset.

        // cash portfolio asset handle differently
        // if this cannot be handled with web sockets, then put use limit is reached by finnhub api rate limits bc have to 
        // time out until rate limit refills
    }
}