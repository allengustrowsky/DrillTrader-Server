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
import { ApiTags } from '@nestjs/swagger';
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
    create(@Body() createAssetDto: CreateAssetDto) {
        return this.assetService.create(createAssetDto);
    }

    @UseGuards(ApiAuthGuard)
    @Get()
    findAll() {
        return this.assetService.findAll();
    }

    @UseGuards(ApiAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.assetService.findOne(+id);
    }

    @UseGuards(IsAdminGuard)
    @UseGuards(ApiAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
        return this.assetService.update(+id, updateAssetDto);
    }

    @UseGuards(IsAdminGuard)
    @UseGuards(ApiAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.assetService.remove(+id);
    }
}
