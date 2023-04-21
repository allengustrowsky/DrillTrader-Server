import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioValueLogger } from './portfolio_value_logger_cron.service';

describe('CronService', () => {
  let service: PortfolioValueLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PortfolioValueLogger],
    }).compile();

    service = module.get<PortfolioValueLogger>(PortfolioValueLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
