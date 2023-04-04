import { Module } from '@nestjs/common';
import { AssetTypeService } from './asset_type.service';
import { AssetTypeController } from './asset_type.controller';

@Module({
    controllers: [AssetTypeController],
    providers: [AssetTypeService],
})
export class AssetTypeModule {}
