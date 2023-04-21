import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

// adapted from nest's article on task scheduling: https://docs.nestjs.com/techniques/task-scheduling
@Injectable()
export class PortfolioValueLogger {

    @Cron(CronExpression.EVERY_10_SECONDS)
    logPortfolioValue() {
        console.log('cron job running! eyyyyyy')
        // this.logger.debug('cron job called')
    }
}