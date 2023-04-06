import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsPositive,
} from 'class-validator';

export class CreateTransactionDto {
    @ApiProperty({
        type: Number,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    portfolio_id: number;

    @ApiProperty({
        type: Number,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    asset_id: number;

    @ApiProperty({
        type: Number,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @IsNumber({ allowNaN: false })
    @IsPositive()
    units: number;

    @ApiProperty({
        type: Number,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @IsNumber({ allowNaN: false })
    @IsPositive()
    price: number;

    @ApiProperty({
        type: Boolean,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @IsBoolean()
    is_buy: boolean;
}
