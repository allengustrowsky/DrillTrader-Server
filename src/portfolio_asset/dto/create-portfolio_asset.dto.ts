import { Optional } from '@nestjs/common';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePortfolioAssetDto {
    @IsNotEmpty()
    @IsInt()
    portfolio_id: number;

    @IsNotEmpty()
    @IsInt()
    asset_id: number;

    @IsNumber({ allowNaN: false })
    @Optional()
    units: number;
}
