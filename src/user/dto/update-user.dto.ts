import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

// export class UpdateUserDto extends PartialType(CreateUserDto) {}
export class UpdateUserDto {
    @ApiPropertyOptional({
        type: String,
        description: 'This is an optional property',
    })
    @Length(1, 32)
    @IsString()
    @IsOptional()
    first_name: string;

    @ApiPropertyOptional({
        type: String,
        description: 'This is an optional property',
    })
    @Length(1, 32)
    @IsString()
    @IsOptional()
    last_name: string;

    @ApiPropertyOptional({
        type: String,
        description: 'This is an optional property',
    })
    @Length(1, 32)
    @IsEmail()
    @IsOptional()
    email_address: string;
}
