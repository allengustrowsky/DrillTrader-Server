import { Module } from '@nestjs/common';
import { PortfolioValueService } from './portfolio_value.service';
import { PortfolioValueController } from './portfolio_value.controller';

@Module({
  controllers: [PortfolioValueController],
  providers: [PortfolioValueService]
})
export class PortfolioValueModule {}
