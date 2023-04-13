import { Collection, Entity, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { CreateAssetTypeDto } from '../dto/create-asset_type.dto';
import { Asset } from '../../asset/entities/asset.entity';

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
        unique: true,
    })
    name!: string;

    @OneToMany(() => Asset, asset => asset.asset_type)
    assets = new Collection<Asset>(this);
}
