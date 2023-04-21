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
import { ApiTags } from '@nestjs/swagger';
import { ApiAuthGuard } from 'src/auth/auth.guard';
import { IsAdminGuard } from 'src/auth/admin.guard';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @UseGuards(ApiAuthGuard)
    @Post()
    create(@Body() createTransactionDto: CreateTransactionDto, @Req() request: Request) {
        return this.transactionService.create(createTransactionDto, request);
    }

    @UseGuards(ApiAuthGuard)
    @Get('/user/:id/:limit')
    findAll(@Param('id') id: string, @Param('limit') limit: string) {
        return this.transactionService.findAll(+id, +limit);
    }

    @UseGuards(ApiAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.transactionService.findOne(+id);
    }

    // @UseGuards(ApiAuthGuard)
    // @Patch(':id')
    // update(
    //     @Param('id') id: string,
    //     @Body() updateTransactionDto: UpdateTransactionDto,
    // ) {
    //     return this.transactionService.update(+id, updateTransactionDto);
    // }

    @UseGuards(IsAdminGuard)
    @UseGuards(ApiAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.transactionService.remove(+id);
    }
}
