import { Test, TestingModule } from '@nestjs/testing';
import { PriceDataController } from './price_data.controller';
import { PriceDataService } from './price_data.service';

describe('PriceDataController', () => {
  let controller: PriceDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriceDataController],
      providers: [PriceDataService],
    }).compile();

    controller = module.get<PriceDataController>(PriceDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
