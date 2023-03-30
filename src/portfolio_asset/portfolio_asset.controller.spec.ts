import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioAssetController } from './portfolio_asset.controller';
import { PortfolioAssetService } from './portfolio_asset.service';

describe('PortfolioAssetController', () => {
  let controller: PortfolioAssetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortfolioAssetController],
      providers: [PortfolioAssetService],
    }).compile();

    controller = module.get<PortfolioAssetController>(PortfolioAssetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
