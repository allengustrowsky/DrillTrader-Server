import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateAssetTypeDto } from './create-asset_type.dto';

export class UpdateAssetTypeDto extends PartialType(CreateAssetTypeDto) {
    @IsNotEmpty()
    @IsString()
    name: string;
}
