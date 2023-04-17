import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuthGuard } from 'src/auth/auth.guard';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @UseGuards(ApiAuthGuard)
    @Post()
    create(@Body() createTransactionDto: CreateTransactionDto) {
        return this.transactionService.create(createTransactionDto);
    }

    @UseGuards(ApiAuthGuard)
    @Get()
    findAll() {
        return this.transactionService.findAll();
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

    @UseGuards(ApiAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.transactionService.remove(+id);
    }
}
