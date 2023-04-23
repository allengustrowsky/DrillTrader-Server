import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreatePortfolioDto {
    // @ApiProperty({
    //     type: Number,
    //     description: 'This is a required property',
    // })
    // @IsNotEmpty()
    // @IsInt()
    // user_id: number;
}
