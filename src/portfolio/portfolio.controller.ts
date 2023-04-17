import {
    Controller,
    Get,
    // Post,
    // Body,
    // Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
// import { CreatePortfolioDto } from './dto/create-portfolio.dto';
// import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

/**
 * This route should not be used often. With the way portfolios are 
 * designed to work, there should rarely be a request made to fetch 
 * or delete portfolios, if ever. They are auto-generated when a new 
 * user is made and should never need to be modified after that. Deleting 
 * a user will automatically delete their portfolio. In light of all of 
 * this, only GET and DELETE routes have been implemented.
 */
@ApiTags('Portfolio')
@Controller('portfolio')
export class PortfolioController {
    constructor(private readonly portfolioService: PortfolioService) {}

    // @Post()
    // create(@Body() createPortfolioDto: CreatePortfolioDto) {
    //     return this.portfolioService.create(createPortfolioDto);
    // }

    @Get()
    @ApiOkResponse({ description: 'Successfully returned resources.' })
    findAll() {
        return this.portfolioService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({ description: 'Successfully returned resource.' })
    @ApiNotFoundResponse({ description: 'Portfolio with this id not found.' })
    findOne(@Param('id') id: string) {
        return this.portfolioService.findOne(+id);
    }

    // @Patch(':id')
    // update(
    //     @Param('id') id: string,
    //     @Body() updatePortfolioDto: UpdatePortfolioDto,
    // ) {
    //     return this.portfolioService.update(+id, updatePortfolioDto);
    // }

    @Delete(':id')
    @ApiOkResponse({ description: 'Successfully deleted resource.' })
    @ApiNotFoundResponse({ description: 'Portfolio with this id not found.' })
    remove(@Param('id') id: string) {
        return this.portfolioService.remove(+id);
    }
}
