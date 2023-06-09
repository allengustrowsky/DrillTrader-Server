import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreatePortfolioAssetDto {
    @ApiProperty({
        type: Number,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @IsInt()
    portfolio_id: number;

    @ApiProperty({
        type: Number,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @IsInt()
    asset_id: number;

    @ApiPropertyOptional({
        type: Number,
        description: 'This is an optional property',
    })
    @IsNumber({ allowNaN: false })
    @IsOptional()
    // credit to chatGPT for idea of using @Min() with @IsNumber() validator
    @Min(0)
    units: number;
}
