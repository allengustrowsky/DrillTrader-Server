// import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
// import { CreateAssetTypeDto } from './create-asset_type.dto';
import { ApiProperty } from '@nestjs/swagger';

// export class UpdateAssetTypeDto extends PartialType(CreateAssetTypeDto) {
export class UpdateAssetTypeDto {
    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    @IsString()
    name: string;
}
