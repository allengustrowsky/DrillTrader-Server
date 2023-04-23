import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UseGuards,
} from '@nestjs/common';
import { AssetTypeService } from './asset_type.service';
import { CreateAssetTypeDto } from './dto/create-asset_type.dto';
import { UpdateAssetTypeDto } from './dto/update-asset_type.dto';
import {
    ApiConflictResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { RemoveAssetsFromTypeInterceptor } from '../interceptors/asset_type.interceptor';
import { ApiAuthGuard } from 'src/auth/auth.guard';
import { IsAdminGuard } from 'src/auth/admin.guard';

@ApiTags('Asset-Type')
@Controller('asset-type')
export class AssetTypeController {
    constructor(private readonly assetTypeService: AssetTypeService) {}

    @UseInterceptors(RemoveAssetsFromTypeInterceptor)
    @Post()
    @ApiOkResponse({ description: 'Asset type successfully created.' })
    @ApiConflictResponse({
        description: 'Asset type with this name already taken.',
    })
    @ApiInternalServerErrorResponse({
        description: 'An internal server error occured.',
    })
    create(@Body() createAssetTypeDto: CreateAssetTypeDto) {
        return this.assetTypeService.create(createAssetTypeDto);
    }

    @UseGuards(ApiAuthGuard)
    @Get()
    @ApiOkResponse({ description: 'Successfully returned resources.' })
    findAll() {
        return this.assetTypeService.findAll();
    }

    @UseGuards(ApiAuthGuard)
    @Get(':id')
    @ApiOkResponse({ description: 'Successfully returned resource.' })
    @ApiNotFoundResponse({ description: 'Resource not found.' })
    findOne(@Param('id') id: string) {
        return this.assetTypeService.findOne(+id);
    }

    @UseGuards(IsAdminGuard)
    @UseGuards(ApiAuthGuard)
    @Patch(':id')
    @ApiOkResponse({ description: 'Successfully updated resource.' })
    @ApiNotFoundResponse({ description: 'Asset type with this id not found.' })
    @ApiConflictResponse({
        description: 'Asset type with this name already taken.',
    })
    @ApiInternalServerErrorResponse({
        description: 'An internal server error occurred.',
    })
    update(
        @Param('id') id: string,
        @Body() updateAssetTypeDto: UpdateAssetTypeDto,
    ) {
        return this.assetTypeService.update(+id, updateAssetTypeDto);
    }

    @UseGuards(IsAdminGuard)
    @UseGuards(ApiAuthGuard)
    @Delete(':id')
    @ApiOkResponse({ description: 'Resource successfully deleted.' })
    @ApiNotFoundResponse({ description: 'Asset type with this id not found.' })
    remove(@Param('id') id: string) {
        return this.assetTypeService.remove(+id);
    }
}
