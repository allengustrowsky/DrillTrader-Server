import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { CreatePortfolioAssetDto } from './dto/create-portfolio_asset.dto';
import { UpdatePortfolioAssetDto } from './dto/update-portfolio_asset.dto';

@Injectable()
export class PortfolioAssetService {
  constructor(private readonly em: EntityManager) {}
  
  create(createPortfolioAssetDto: CreatePortfolioAssetDto) {
    return 'This action adds a new portfolioAsset';
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
