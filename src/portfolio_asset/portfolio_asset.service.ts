import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { CreatePortfolioAssetDto } from './dto/create-portfolio_asset.dto';
import { UpdatePortfolioAssetDto } from './dto/update-portfolio_asset.dto';
import { PortfolioAsset } from './entities/portfolio_asset.entity';

@Injectable()
export class PortfolioAssetService {
    constructor(private readonly em: EntityManager) {}

    async create(createPortfolioAssetDto: CreatePortfolioAssetDto) {
        const portfolio_asset = new PortfolioAsset(createPortfolioAssetDto)
        await this.em.persistAndFlush(portfolio_asset)
        return portfolio_asset
    }

    findAll() {
        return `This action returns all portfolioAsset`;
    }

    findOne(id: number) {
        return `This action returns a #${id} portfolioAsset`;
    }

    update(id: number, updatePortfolioAssetDto: UpdatePortfolioAssetDto) {
        return `This action updates a #${id} portfolioAsset`;
    }

    remove(id: number) {
        return `This action removes a #${id} portfolioAsset`;
    }
}
