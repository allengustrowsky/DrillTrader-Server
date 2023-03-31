import { IsBoolean, IsEmail, IsNotEmpty, IsString, Length } from "class-validator";


export class CreateUserDto {
    @IsNotEmpty()
    @Length(1, 32)
    @IsString()
    first_name: string;

    @IsNotEmpty()
    @Length(1, 32)
    @IsString()
    last_name: string;

    @IsNotEmpty()
    @Length(1, 32)
    @IsEmail()
    email_address: string;

    @IsNotEmpty()
    @Length(1, 128)
    password_hash: string;
}
