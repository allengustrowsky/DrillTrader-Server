import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities/asset.entity';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { AssetType } from 'src/asset_type/entities/asset_type.entity';

@Injectable()
export class AssetService {
    constructor(private readonly em: EntityManager) {}

    async create(createAssetDto: CreateAssetDto) {
        const asset = new Asset({name: createAssetDto.name, ticker_symbol: createAssetDto.ticker_symbol});
        const asset_type = await this.em.findOne(AssetType, createAssetDto.asset_type_id);
        if (!asset_type) {
            throw new HttpException(`Asset with id ${createAssetDto.asset_type_id} not found.`, HttpStatus.BAD_REQUEST);
        } else {
            asset.asset_type = asset_type
        }

        try {
            await this.em.persistAndFlush(asset);
            return asset;
        } catch (e) {
            if (e instanceof UniqueConstraintViolationException) {
                throw new HttpException("Name and ticker symbol must be unique.", HttpStatus.BAD_REQUEST)
            } else {
                throw new HttpException("An error occurred!", HttpStatus.CONFLICT)
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

    update(id: number, updateAssetDto: UpdateAssetDto) {
        return `This action updates a #${id} asset`;
    }

    remove(id: number) {
        return `This action removes a #${id} asset`;
    }
}
