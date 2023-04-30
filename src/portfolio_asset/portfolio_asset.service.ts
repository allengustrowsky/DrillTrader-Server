import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePortfolioAssetDto } from './dto/create-portfolio_asset.dto';
import { UpdatePortfolioAssetDto } from './dto/update-portfolio_asset.dto';
import { PortfolioAsset } from './entities/portfolio_asset.entity';
import { Portfolio } from 'src/portfolio/entities/portfolio.entity';
import { Asset } from 'src/asset/entities/asset.entity';

@Injectable()
export class PortfolioAssetService {
    constructor(private readonly em: EntityManager) {}

    async create(createPortfolioAssetDto: CreatePortfolioAssetDto) {
        const portfolio_asset = new PortfolioAsset(createPortfolioAssetDto);

        // set portfolio
        const portfolio = await this.em.findOne(
            Portfolio,
            createPortfolioAssetDto.portfolio_id,
        );
        if (!portfolio) {
            throw new HttpException(
                `Portfolio with id ${createPortfolioAssetDto.portfolio_id} not found.`,
                HttpStatus.NOT_FOUND,
            );
        } else {
            portfolio_asset.portfolio = portfolio;
        }

        // set asset
        const asset = await this.em.findOne(
            Asset,
            createPortfolioAssetDto.asset_id,
        );
        if (!asset) {
            throw new HttpException(
                `Asset with id ${createPortfolioAssetDto.asset_id} not found.`,
                HttpStatus.NOT_FOUND,
            );
        } else {
            portfolio_asset.asset = asset;
        }

        // portfolio_id and asset_id together must be unique
        const duplicate_pa = await this.em.find(PortfolioAsset, {
            asset: asset,
            portfolio: portfolio,
        });
        if (duplicate_pa.length > 0) {
            throw new HttpException(
                `Portfolio asset of this type for this user's portfolio already exists.`,
                HttpStatus.CONFLICT,
            );
        }

        await this.em.persistAndFlush(portfolio_asset);
        return portfolio_asset;
    }

    async findAllUser(id: number, request: Request) {
        // make sure user is allowed to access this data (owner or admin)
        const isAuthorized =
            id === (request as any).user.id || (request as any).user.is_admin;
        if (!isAuthorized) {
            throw new HttpException(
                "You are not allowed to access this user's portfolio assets.",
                HttpStatus.FORBIDDEN,
            );
        }

        const portfolio_assets = this.em.find(PortfolioAsset, {
            portfolio: id,
        }, { populate: ['asset'] });
        return portfolio_assets;
    }

    async findAll() {
        const portfolio_assets = await this.em.find(PortfolioAsset, {}, { populate: ['asset'] });
        return portfolio_assets;
    }

    async findOne(userId: number, assetId: number, request: Request) {
        // make sure user is allowed to access this data (owner or admin)
        const isAuthorized =
        userId === (request as any).user.id ||
        (request as any).user.is_admin;
        if (!isAuthorized) {
            throw new HttpException(
                'You are not allowed to access this portfolio asset.',
                HttpStatus.FORBIDDEN,
            );
        }


        const portfolioAsset = await this.em.findOne(PortfolioAsset, {portfolio: userId, asset: assetId}, { populate: ['asset'] });
        if (!portfolioAsset) {
            throw new HttpException(
                `Portfolio asset for user ${userId} with id ${assetId} not found.`,
                HttpStatus.NOT_FOUND,
            );
        }

        return portfolioAsset;
    }

    async update(id: number, updatePortfolioAssetDto: UpdatePortfolioAssetDto) {
        // make sure id is valid portfolio_asset id
        const portfolio_asset = await this.em.findOne(PortfolioAsset, id);
        if (!portfolio_asset) {
            throw new HttpException(
                `Portfolio asset with id ${id} not found.`,
                HttpStatus.NOT_FOUND,
            );
        }

        if (updatePortfolioAssetDto.units) {
            portfolio_asset.units = updatePortfolioAssetDto.units;
        }
        if (updatePortfolioAssetDto.asset_id) {
            const asset = await this.em.findOne(
                Asset,
                updatePortfolioAssetDto.asset_id,
            );
            if (!asset) {
                throw new HttpException(
                    `Asset with id ${updatePortfolioAssetDto.asset_id} not found.`,
                    HttpStatus.NOT_FOUND,
                );
            }
            portfolio_asset.asset = asset;
        }
        if (updatePortfolioAssetDto.portfolio_id) {
            const portfolio = await this.em.findOne(
                Portfolio,
                updatePortfolioAssetDto.portfolio_id,
            );
            if (!portfolio) {
                throw new HttpException(
                    `Portfolio with id ${updatePortfolioAssetDto.portfolio_id} not found.`,
                    HttpStatus.NOT_FOUND,
                );
            }
            portfolio_asset.portfolio = portfolio;
        }

        try {
            await this.em.persistAndFlush(portfolio_asset);
            return portfolio_asset;
        } catch (e) {
            throw new HttpException(
                `An error occurred: ${e}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async remove(id: number) {
        const portfolio_asset = await this.em.findOne(PortfolioAsset, id);
        if (!portfolio_asset) {
            throw new HttpException(
                `Portfolio asset with id ${id} not found.`,
                HttpStatus.NOT_FOUND,
            );
        }

        await this.em.removeAndFlush(portfolio_asset);
        return portfolio_asset;
    }
}
