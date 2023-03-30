import { PartialType } from '@nestjs/mapped-types';
import { CreateAssetTypeDto } from './create-asset_type.dto';

export class UpdateAssetTypeDto extends PartialType(CreateAssetTypeDto) {}
