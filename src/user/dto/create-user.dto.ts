import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsString,
    Length,
} from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @Length(1, 32)
    @IsString()
    first_name: string;

    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @Length(1, 32)
    @IsString()
    last_name: string;

    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @Length(1, 32)
    @IsEmail()
    email_address: string;
}
