import { Test, TestingModule } from '@nestjs/testing';
import { AssetTypeController } from './asset_type.controller';
import { AssetTypeService } from './asset_type.service';

describe('AssetTypeController', () => {
  let controller: AssetTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetTypeController],
      providers: [AssetTypeService],
    }).compile();

    controller = module.get<AssetTypeController>(AssetTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
