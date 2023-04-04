import { IsInt, IsNotEmpty, IsNumber } from "class-validator";

export class CreatePortfolioAssetDto {
    @IsNotEmpty()
    @IsInt()
    portfolio_id: number;
    
    @IsNotEmpty()
    @IsInt()
    asset_id: number;
    
    @IsNumber()
    units: number;
}
