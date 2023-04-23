import { Module } from '@nestjs/common';
import { PriceDataService } from './price_data.service';
import { PriceDataController } from './price_data.controller';

@Module({
  controllers: [PriceDataController],
  providers: [PriceDataService]
})
export class PriceDataModule {}
