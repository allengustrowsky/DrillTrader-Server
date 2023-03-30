import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioValueService } from './portfolio_value.service';

describe('PortfolioValueService', () => {
  let service: PortfolioValueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PortfolioValueService],
    }).compile();

    service = module.get<PortfolioValueService>(PortfolioValueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
