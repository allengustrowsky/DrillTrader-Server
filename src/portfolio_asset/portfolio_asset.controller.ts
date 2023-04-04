import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { PortfolioAssetService } from './portfolio_asset.service';
import { CreatePortfolioAssetDto } from './dto/create-portfolio_asset.dto';
import { UpdatePortfolioAssetDto } from './dto/update-portfolio_asset.dto';

@Controller('portfolio-asset')
export class PortfolioAssetController {
    constructor(
        private readonly portfolioAssetService: PortfolioAssetService,
    ) {}

    @Post()
    create(@Body() createPortfolioAssetDto: CreatePortfolioAssetDto) {
        return this.portfolioAssetService.create(createPortfolioAssetDto);
    }

    @Get()
    findAll() {
        return this.portfolioAssetService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.portfolioAssetService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updatePortfolioAssetDto: UpdatePortfolioAssetDto,
    ) {
        return this.portfolioAssetService.update(+id, updatePortfolioAssetDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.portfolioAssetService.remove(+id);
    }
}
