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
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
    ApiBadRequestResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
    ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { ApiAuthGuard } from 'src/auth/auth.guard';
import { IsAdminGuard } from 'src/auth/admin.guard';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @UseGuards(ApiAuthGuard)
    @Post()
    @ApiOkResponse({ description: 'Successfully created resource.' })
    @ApiForbiddenResponse({
        description: 'You are not allowed to access this portfolio.',
    })
    @ApiNotFoundResponse({ description: 'Asset with this id does not exist.' })
    @ApiBadRequestResponse({ description: 'No cash for this transaction.' })
    @ApiBadRequestResponse({ description: 'You have no cash to withdraw.' })
    @ApiBadRequestResponse({
        description: 'You do not have enough cash to withdraw.',
    })
    @ApiTooManyRequestsResponse({
        description:
            'API limit reached. Please wait a for a minute to continue using the API.',
    })
    @ApiBadRequestResponse({
        description: 'You do not have enough cash to make this transaction.',
    })
    @ApiBadRequestResponse({
        description: 'You do not have any units of this asset to sell.',
    })
    @ApiBadRequestResponse({
        description: 'You do not have enough units of this asset to sell.',
    })
    create(
        @Body() createTransactionDto: CreateTransactionDto,
        @Req() request: Request,
    ) {
        return this.transactionService.create(createTransactionDto, request);
    }

    @UseGuards(ApiAuthGuard)
    @Get('/:id/:limit') // userid
    @ApiOkResponse({ description: 'Successfully returned resources.' })
    @ApiForbiddenResponse({
        description: "You are not allowed to access this user' transactions.",
    })
    findAll( // find all transactions for a user, number of transactions specified by limit
        @Param('id') id: string,
        @Param('limit') limit: string,
        @Req() request: Request,
    ) {
        return this.transactionService.findAllUser(+id, +limit, request);
    }

    @UseGuards(ApiAuthGuard)
    @Get(':id') // single transaction id
    @ApiOkResponse({ description: 'Successfully returned resource.' })
    @ApiNotFoundResponse({ description: 'Transaction with this id not found.' })
    @ApiForbiddenResponse({
        description: "You are not allowed to access this user' transactions.",
    })
    findOne(@Param('id') id: string, @Req() request: Request) { // find one transaction
        return this.transactionService.findOne(+id, request);
    }

    // @UseGuards(ApiAuthGuard)
    // @Patch(':id')
    // update(
    //     @Param('id') id: string,
    //     @Body() updateTransactionDto: UpdateTransactionDto,
    // ) {
    //     return this.transactionService.update(+id, updateTransactionDto);
    // }

    // @UseGuards(IsAdminGuard)
    // @UseGuards(ApiAuthGuard)
    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.transactionService.remove(+id);
    // }
}
