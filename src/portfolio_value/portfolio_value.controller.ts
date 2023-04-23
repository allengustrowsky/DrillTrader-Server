import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    UseGuards,
} from '@nestjs/common';
import { PortfolioValueService } from './portfolio_value.service';
import { CreatePortfolioValueDto } from './dto/create-portfolio_value.dto';
import { UpdatePortfolioValueDto } from './dto/update-portfolio_value.dto';
import {
    ApiBadRequestResponse,
    ApiForbiddenResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ApiAuthGuard } from 'src/auth/auth.guard';

@ApiTags('Portfolio-Value')
@Controller('portfolio-value')
export class PortfolioValueController {
    constructor(
        private readonly portfolioValueService: PortfolioValueService,
    ) {}

    // @Post()
    // create(@Body() createPortfolioValueDto: CreatePortfolioValueDto) {
    //     return this.portfolioValueService.create(createPortfolioValueDto);
    // }

    @UseGuards(ApiAuthGuard)
    @Get('/user/:userId')
    @ApiOkResponse({ description: 'Successfully returned resources.' })
    @ApiForbiddenResponse({
        description:
            "You are not allowed to access the value of this user's portfolio.",
    })
    findAll(@Param('userId') userId: string, @Req() request: Request) {
        return this.portfolioValueService.findAll(+userId, request);
    }

    /**
     * Returns the portfolio value of a given portfolio
     */
    @UseGuards(ApiAuthGuard)
    @Get(':portfolioId')
    @ApiOkResponse({ description: 'Successfully returned resource.' })
    @ApiForbiddenResponse({
        description:
            "You are not allowed to access this the value of this user's portfolio.",
    })
    @ApiBadRequestResponse({
        description: 'No portfolio value has been recorded for this portfolio.',
    })
    findOne(
        @Param('portfolioId') portfolioId: string,
        @Req() request: Request,
    ) {
        return this.portfolioValueService.findOne(+portfolioId, request);
    }

    // @Patch(':id')
    // update(
    //     @Param('id') id: string,
    //     @Body() updatePortfolioValueDto: UpdatePortfolioValueDto,
    // ) {
    //     return this.portfolioValueService.update(+id, updatePortfolioValueDto);
    // }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.portfolioValueService.remove(+id);
    // }
}
