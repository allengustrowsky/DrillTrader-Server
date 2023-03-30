import { Module } from '@nestjs/common';
import { PortfolioAssetService } from './portfolio_asset.service';
import { PortfolioAssetController } from './portfolio_asset.controller';

@Module({
  controllers: [PortfolioAssetController],
  providers: [PortfolioAssetService]
})
export class PortfolioAssetModule {}
