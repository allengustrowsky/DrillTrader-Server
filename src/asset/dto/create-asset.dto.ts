import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateAssetDto {
    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        type: Number,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @IsInt()
    asset_type_id: number;

    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @IsString()
    ticker_symbol: string;
}
