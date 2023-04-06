import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { CreateAssetDto } from '../dto/create-asset.dto';

@Entity()
export class Asset {
    constructor(createAssetDto: CreateAssetDto) {
        this.name = createAssetDto.name
        this.asset_type_id = createAssetDto.asset_type_id
        this.ticker_symbol = createAssetDto.ticker_symbol
    }

    @PrimaryKey({
        autoincrement: true,
    })
    id!: number;

    @Property({
        length: 64,
    })
    name!: string;

    // TODO: make foreign key
    @Property()
    asset_type_id: number;

    @Property({
        length: 16,
    })
    ticker_symbol!: string;
}
