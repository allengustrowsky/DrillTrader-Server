import {
    Controller,
    Get,
    // Post,
    // Body,
    // Patch,
    Param,
    Delete,
    UseGuards,
    Req,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
// import { CreatePortfolioDto } from './dto/create-portfolio.dto';
// import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiAuthGuard } from 'src/auth/auth.guard';
import { IsAdminGuard } from 'src/auth/admin.guard';

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

    @UseGuards(IsAdminGuard)
    @UseGuards(ApiAuthGuard)
    @Get()
    @ApiOkResponse({ description: 'Successfully returned resources.' })
    findAll() {
        return this.portfolioService.findAll();
    }

    @UseGuards(ApiAuthGuard)
    @Get(':id')
    @ApiOkResponse({ description: 'Successfully returned resource.' })
    @ApiNotFoundResponse({ description: 'Portfolio with this id not found.' })
    @ApiForbiddenResponse({ description: 'You are not allowed to access this portfolio.' })
    findOne(@Param('id') id: string, @Req() request: Request) {
        return this.portfolioService.findOne(+id, request);
    }

    // @Patch(':id')
    // update(
    //     @Param('id') id: string,
    //     @Body() updatePortfolioDto: UpdatePortfolioDto,
    // ) {
    //     return this.portfolioService.update(+id, updatePortfolioDto);
    // }

    @UseGuards(IsAdminGuard)
    @UseGuards(ApiAuthGuard)
    @Delete(':id')
    @ApiOkResponse({ description: 'Successfully deleted resource.' })
    @ApiNotFoundResponse({ description: 'Portfolio with this id not found.' })
    remove(@Param('id') id: string) {
        // Warning: It is highly advised to NOT DELETE these. It will likely ruin 
        // the logic for the rest of the user's account.
        return this.portfolioService.remove(+id);
    }
}
