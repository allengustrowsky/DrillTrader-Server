import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAssetTypeDto } from './dto/create-asset_type.dto';
import { UpdateAssetTypeDto } from './dto/update-asset_type.dto';
import { AssetType } from './entities/asset_type.entity';
import { UniqueConstraintViolationException } from '@mikro-orm/core';

@Injectable()
export class AssetTypeService {
    constructor(private readonly em: EntityManager) {}

    async create(createAssetTypeDto: CreateAssetTypeDto) {
        const assetType = new AssetType(createAssetTypeDto);

        try {
            await this.em.persistAndFlush(assetType);
        } catch (e) {
            if (e instanceof UniqueConstraintViolationException) {
                throw new HttpException("Name must be unique.", HttpStatus.BAD_REQUEST)
            } else {
                throw new HttpException("An error occurred!", HttpStatus.CONFLICT)
            }
        }

        return assetType;
    }

    findAll() {
        return `This action returns all assetType`;
    }

    findOne(id: number) {
        return `This action returns a #${id} assetType`;
    }

    update(id: number, updateAssetTypeDto: UpdateAssetTypeDto) {
        return `This action updates a #${id} assetType`;
    }

    remove(id: number) {
        return `This action removes a #${id} assetType`;
    }
}
