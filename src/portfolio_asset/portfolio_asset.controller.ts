import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
} from '@nestjs/common';
import { PortfolioAssetService } from './portfolio_asset.service';
import { CreatePortfolioAssetDto } from './dto/create-portfolio_asset.dto';
import { UpdatePortfolioAssetDto } from './dto/update-portfolio_asset.dto';
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiMethodNotAllowedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ApiAuthGuard } from 'src/auth/auth.guard';
import { IsAdminGuard } from 'src/auth/admin.guard';

@ApiTags('Portfolio-Asset')
@Controller('portfolio-asset')
export class PortfolioAssetController {
    constructor(
        private readonly portfolioAssetService: PortfolioAssetService,
    ) {}

    @UseGuards(IsAdminGuard)
    @UseGuards(ApiAuthGuard)
    @Post()
    @ApiOkResponse({ description: 'Successfully created resources.' })
    @ApiBadRequestResponse({
        description: 'Unites must not be less than zero.',
    })
    @ApiNotFoundResponse({ description: 'Portfolio with given id not found.' })
    @ApiNotFoundResponse({ description: 'Asset with given id not found.' })
    @ApiConflictResponse({
        description:
            "Portfolio asset of this type for this user's portfolio already exists.",
    })
    create(@Body() createPortfolioAssetDto: CreatePortfolioAssetDto) {
        return this.portfolioAssetService.create(createPortfolioAssetDto);
    }

    @UseGuards(IsAdminGuard)
    @UseGuards(ApiAuthGuard)
    @Get()
    @ApiOkResponse({ description: 'Successfully returned resources.' })
    findAll() {
        return this.portfolioAssetService.findAll();
    }

    @UseGuards(ApiAuthGuard)
    @Get('/user/:id')
    @ApiOkResponse({ description: 'Successfully returned resources.' })
    @ApiMethodNotAllowedResponse({
        description:
            "You are not allowed to access this user's portfolio assets.",
    })
    findAllUser(@Param('id') id: string, @Req() request: Request) {
        return this.portfolioAssetService.findAllUser(+id, request);
    }

    @UseGuards(ApiAuthGuard)
    @Get(':id')
    @ApiOkResponse({ description: 'Successfully returned resource.' })
    @ApiNotFoundResponse({
        description: 'Portfolio asset with this id not found.',
    })
    @ApiMethodNotAllowedResponse({
        description:
            "You are not allowed to access this user's portfolio assets.",
    })
    findOne(@Param('id') id: string, @Req() request: Request) {
        return this.portfolioAssetService.findOne(+id, request);
    }

    @UseGuards(IsAdminGuard)
    @UseGuards(ApiAuthGuard)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updatePortfolioAssetDto: UpdatePortfolioAssetDto,
    ) {
        return this.portfolioAssetService.update(+id, updatePortfolioAssetDto);
    }

    @UseGuards(IsAdminGuard)
    @UseGuards(ApiAuthGuard)
    @Delete(':id')
    @ApiOkResponse({ description: 'Successfully deleted resource.' })
    @ApiNotFoundResponse({
        description: 'Portfolio asset with this id not found.',
    })
    remove(@Param('id') id: string) {
        return this.portfolioAssetService.remove(+id);
    }
}
