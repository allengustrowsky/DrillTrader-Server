import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsPositive } from "class-validator";


export class CreateTransactionDto {
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    portfolio_id: number;

    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    asset_id: number;

    @IsNotEmpty()
    @IsNumber({ allowNaN: false })
    @IsPositive()
    units: number;

    @IsNotEmpty()
    @IsNumber({ allowNaN: false })
    @IsPositive()
    price: number;

    @IsNotEmpty()
    @IsBoolean()
    is_buy: boolean;
}
