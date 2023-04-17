import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssetTypeDto } from './dto/create-asset_type.dto';
import { UpdateAssetTypeDto } from './dto/update-asset_type.dto';
import { AssetType } from './entities/asset_type.entity';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { Asset } from 'src/asset/entities/asset.entity';

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

    async findAll() {
        const assetTypes = await this.em.find(AssetType, {})
        return assetTypes;
    }

    async findOne(id: number) {
        const assetType = await this.em.findOne(AssetType, id)
        if (!assetType) {
            throw new NotFoundException(`AssetType with id ${id} not found`);
        }
        return assetType
    }

    async update(id: number, updateAssetTypeDto: UpdateAssetTypeDto) {
        const assetType = await this.em.findOne(AssetType, id);
        if (!assetType) {
            throw new NotFoundException(`AssetType with id ${id} not found`);
        }
        assetType.name = updateAssetTypeDto.name;

        try {
            await this.em.persistAndFlush(assetType)
        } catch (e) {
            if (e instanceof UniqueConstraintViolationException) {
                throw new HttpException("This name has already been taken.", HttpStatus.BAD_REQUEST)
            } else {
                throw new HttpException("An error occurred!", HttpStatus.CONFLICT) 
            }
        }

        return assetType;
    }

    async remove(id: number) {
        const assetType = await this.em.findOne(AssetType, id);
        if (assetType) {
            await this.em.remove(assetType).flush()
            return assetType;
        } else {
            throw new NotFoundException(`AssetType with id ${id} not found`);
        }
    }
}
