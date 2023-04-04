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
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
