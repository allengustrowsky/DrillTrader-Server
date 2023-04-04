import { IsInt, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CreatePortfolioValueDto {
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    portfolio_id: number;

    @IsNotEmpty()
    @IsNumber()
    value: number;

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    created_at: number;
}
