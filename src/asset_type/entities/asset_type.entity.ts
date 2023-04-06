import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { CreateAssetTypeDto } from '../dto/create-asset_type.dto';

@Entity()
export class AssetType {
    constructor(createAssetTypeDto: CreateAssetTypeDto) {
        this.name = createAssetTypeDto.name
    }

    @PrimaryKey({
        autoincrement: true,
    })
    readonly id!: number;

    @Property({
        length: 64,
    })
    name!: string;
}
