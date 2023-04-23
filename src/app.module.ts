import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AssetModule } from './asset/asset.module';
import { AssetTypeModule } from './asset_type/asset_type.module';
import { UserModule } from './user/user.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { PortfolioAssetModule } from './portfolio_asset/portfolio_asset.module';
import { TransactionModule } from './transaction/transaction.module';
import { PortfolioValueModule } from './portfolio_value/portfolio_value.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PortfolioValueLogger } from './cron/portfolio_value_logger_cron.service';
import { PriceDataModule } from './price_data/price_data.module';
import { LivePriceDataService } from './live_price_data/live_price_data.service';

@Module({
    imports: [
        MikroOrmModule.forRoot(),
        AssetModule,
        AssetTypeModule,
        UserModule,
        PortfolioModule,
        PortfolioAssetModule,
        TransactionModule,
        PortfolioValueModule,
        ScheduleModule.forRoot(),
        PriceDataModule,
    ],
    controllers: [AppController],
    providers: [AppService, PortfolioValueLogger, LivePriceDataService],
})
export class AppModule {}
