import { IsInt, IsNotEmpty } from "class-validator";

export class CreatePortfolioDto {
    @IsNotEmpty()
    @IsInt()
    user_id: number;
}
