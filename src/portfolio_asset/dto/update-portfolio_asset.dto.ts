import { PartialType } from '@nestjs/mapped-types';
import { CreatePortfolioAssetDto } from './create-portfolio_asset.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdatePortfolioAssetDto {
    @ApiPropertyOptional({
        type: Number,
        description: 'This is an optional property',
    })
    @IsOptional()
    @IsInt()
    portfolio_id: number;

    @ApiPropertyOptional({
        type: Number,
        description: 'This is an optional property',
    })
    @IsOptional()
    @IsInt()
    asset_id: number;

    @ApiPropertyOptional({
        type: Number,
        description: 'This is an optional property',
    })
    @IsOptional()
    @IsNumber()
    // credit to chatGPT for idea of using @Min() with @IsNumber() validator
    @Min(0)
    units: number;
}
