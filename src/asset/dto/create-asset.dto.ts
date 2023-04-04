import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateAssetDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsInt()
    asset_type_id: number;

    @IsNotEmpty()
    @IsString()
    ticker_symbol: string;
}
