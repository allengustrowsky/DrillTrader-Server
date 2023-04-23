import { EntityManager } from '@mikro-orm/mysql';
import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities/asset.entity';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { AssetType } from 'src/asset_type/entities/asset_type.entity';

@Injectable()
export class AssetService {
    constructor(private readonly em: EntityManager) {}

    async create(createAssetDto: CreateAssetDto) {
        const asset = new Asset({
            name: createAssetDto.name,
            ticker_symbol: createAssetDto.ticker_symbol,
        });
        const asset_type = await this.em.findOne(
            AssetType,
            createAssetDto.asset_type_id,
        );
        if (!asset_type) {
            throw new HttpException(
                `Asset with id ${createAssetDto.asset_type_id} not found.`,
                HttpStatus.NOT_FOUND,
            );
        } else {
            asset.asset_type = asset_type;
        }

        try {
            await this.em.persistAndFlush(asset);
            return asset;
        } catch (e) {
            if (e instanceof UniqueConstraintViolationException) {
                throw new HttpException(
                    'Name and ticker symbol must be unique.',
                    HttpStatus.CONFLICT,
                );
            } else {
                throw new HttpException(
                    'An error occurred!',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    async findAll() {
        const assets = await this.em.find(Asset, {});
        return assets;
    }

    async findOne(id: number) {
        const asset = await this.em.findOne(Asset, id);
        if (!asset) {
            throw new NotFoundException(`Asset with id ${id} not found`);
        }
        return asset;
    }

    async update(id: number, updateAssetDto: UpdateAssetDto) {
        const asset = await this.em.findOne(Asset, id);
        if (!asset) {
            throw new NotFoundException(`Asset with id ${id} not found.`);
        }

        if (updateAssetDto.name) {
            asset.name = updateAssetDto.name;
        }
        if (updateAssetDto.asset_type_id) {
            const assetType = await this.em.findOne(
                AssetType,
                updateAssetDto.asset_type_id,
            );
            if (!assetType) {
                throw new HttpException(
                    `Asset type with id ${updateAssetDto.asset_type_id} not found.`,
                    HttpStatus.NOT_FOUND,
                );
            }
            asset.asset_type = assetType;
        }
        if (updateAssetDto.ticker_symbol) {
            asset.ticker_symbol = updateAssetDto.ticker_symbol;
        }

        try {
            await this.em.persistAndFlush(asset);
            return asset;
        } catch (e) {
            if (e instanceof UniqueConstraintViolationException) {
                throw new HttpException(
                    'One of these values is already taken.',
                    HttpStatus.CONFLICT,
                );
            } else {
                throw new HttpException(
                    'An error occurred!',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    async remove(id: number) {
        const asset = await this.em.findOne(Asset, id);
        if (asset) {
            await this.em.remove(asset).flush();
            return asset;
        } else {
            throw new NotFoundException(`Asset with id ${id} not found`);
        }
    }
}
