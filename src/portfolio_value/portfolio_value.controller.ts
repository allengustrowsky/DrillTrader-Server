import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { PortfolioValueService } from './portfolio_value.service';
import { CreatePortfolioValueDto } from './dto/create-portfolio_value.dto';
import { UpdatePortfolioValueDto } from './dto/update-portfolio_value.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Portfolio-Value')
@Controller('portfolio-value')
export class PortfolioValueController {
    constructor(
        private readonly portfolioValueService: PortfolioValueService,
    ) {}

    @Post()
    create(@Body() createPortfolioValueDto: CreatePortfolioValueDto) {
        return this.portfolioValueService.create(createPortfolioValueDto);
    }

    @Get()
    findAll() {
        return this.portfolioValueService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.portfolioValueService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updatePortfolioValueDto: UpdatePortfolioValueDto,
    ) {
        return this.portfolioValueService.update(+id, updatePortfolioValueDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.portfolioValueService.remove(+id);
    }
}
