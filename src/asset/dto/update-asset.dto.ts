import { PartialType } from '@nestjs/mapped-types';
import { CreateAssetDto } from './create-asset.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateAssetDto {
    @ApiPropertyOptional({
        type: String,
        description: 'This is a required property',
    })
    @IsOptional()
    @IsString()
    name: string;

    @ApiPropertyOptional({
        type: Number,
        description: 'This is a required property',
    })
    @IsOptional()
    @IsInt()
    asset_type_id: number;

    @ApiPropertyOptional({
        type: String,
        description: 'This is a required property',
    })
    @IsOptional()
    @IsString()
    ticker_symbol: string;
}
