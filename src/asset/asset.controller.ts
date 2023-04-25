import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import {
    ApiConflictResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ApiAuthGuard } from 'src/auth/auth.guard';
import { IsAdminGuard } from 'src/auth/admin.guard';
import { RemoveAssetPTInterceptor } from 'src/interceptors/asset.interceptor';

@ApiTags('Asset')
@Controller('asset')
export class AssetController {
    constructor(private readonly assetService: AssetService) {}

    @UseInterceptors(RemoveAssetPTInterceptor)
    @UseGuards(IsAdminGuard)
    @UseGuards(ApiAuthGuard)
    @Post()
    @ApiOkResponse({ description: 'Asset successfully created.' })
    @ApiNotFoundResponse({ description: 'Asset with this id not found.' })
    @ApiConflictResponse({
        description: 'Name and ticker symbol must be unique.',
    })
    @ApiInternalServerErrorResponse({
        description: 'An internal server error occurred.',
    })
    create(@Body() createAssetDto: CreateAssetDto) {
        return this.assetService.create(createAssetDto);
    }

    @UseGuards(ApiAuthGuard)
    @Get()
    @ApiOkResponse({ description: 'Successfully returned resources.' })
    findAll() { // get all assets
        return this.assetService.findAll();
    }

    @UseGuards(ApiAuthGuard)
    @Get(':id')
    @ApiOkResponse({ description: 'Successfully returned resource.' })
    @ApiNotFoundResponse({ description: 'Asset with this id not found.' })
    findOne(@Param('id') id: string) { // get one asset
        return this.assetService.findOne(+id);
    }

    @UseGuards(IsAdminGuard)
    @UseGuards(ApiAuthGuard)
    @Patch(':id')
    @ApiOkResponse({ description: 'Successfully updated resource.' })
    @ApiNotFoundResponse({ description: 'Asset with this id not found.' })
    @ApiNotFoundResponse({ description: 'Asset type with this id not found.' })
    @ApiConflictResponse({
        description:
            'At least one of the values provided that must be unique is already taken.',
    })
    @ApiInternalServerErrorResponse({
        description: 'An internal server error occurred.',
    })
    update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
        return this.assetService.update(+id, updateAssetDto);
    }

    @UseGuards(IsAdminGuard)
    @UseGuards(ApiAuthGuard)
    @Delete(':id')
    @ApiOkResponse({ description: 'Successfully deleted resource.' })
    @ApiNotFoundResponse({ description: 'Asset with this id not found.' })
    remove(@Param('id') id: string) {
        return this.assetService.remove(+id);
    }
}
