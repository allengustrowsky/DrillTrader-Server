import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioAssetService } from './portfolio_asset.service';

describe('PortfolioAssetService', () => {
  let service: PortfolioAssetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PortfolioAssetService],
    }).compile();

    service = module.get<PortfolioAssetService>(PortfolioAssetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
