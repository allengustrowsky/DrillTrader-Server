import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { AssetTypeService } from './asset_type.service';
import { CreateAssetTypeDto } from './dto/create-asset_type.dto';
import { UpdateAssetTypeDto } from './dto/update-asset_type.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Asset-Type')
@Controller('asset-type')
export class AssetTypeController {
    constructor(private readonly assetTypeService: AssetTypeService) {}

    @Post()
    create(@Body() createAssetTypeDto: CreateAssetTypeDto) {
        return this.assetTypeService.create(createAssetTypeDto);
    }

    @Get()
    findAll() {
        return this.assetTypeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.assetTypeService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateAssetTypeDto: UpdateAssetTypeDto,
    ) {
        return this.assetTypeService.update(+id, updateAssetTypeDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.assetTypeService.remove(+id);
    }
}
