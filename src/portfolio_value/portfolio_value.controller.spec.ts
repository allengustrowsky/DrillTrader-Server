import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioValueController } from './portfolio_value.controller';
import { PortfolioValueService } from './portfolio_value.service';

describe('PortfolioValueController', () => {
  let controller: PortfolioValueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortfolioValueController],
      providers: [PortfolioValueService],
    }).compile();

    controller = module.get<PortfolioValueController>(PortfolioValueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
