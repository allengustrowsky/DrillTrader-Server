import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';

@Injectable()
export class AssetService {
    constructor(private readonly em: EntityManager) {}

    create(createAssetDto: CreateAssetDto) {
        return 'This action adds a new asset';
    }

    findAll() {
        // return this.em.find(id)
        return `This action returns all asset`;
    }

    findOne(id: number) {
        return `This action returns a #${id} asset`;
    }

    update(id: number, updateAssetDto: UpdateAssetDto) {
        return `This action updates a #${id} asset`;
    }

    remove(id: number) {
        return `This action removes a #${id} asset`;
    }
}
