import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
    LivePriceDataService,
    AssetList,
} from '../live_price_data/live_price_data.service';
import { EntityManager } from '@mikro-orm/mysql';
import { Asset } from 'src/asset/entities/asset.entity';
import { AssetType } from 'src/asset_type/assetType.enum';
// import { CreatePriceDatumDto } from './dto/create-price_datum.dto';
// import { UpdatePriceDatumDto } from './dto/update-price_datum.dto';

@Injectable()
export class PriceDataService {
    constructor(private em: EntityManager) {}

    //   create(createPriceDatumDto: CreatePriceDatumDto) {
    //     return 'This action adds a new priceDatum';
    //   }

    findAll(): AssetList {
        return {
            "$": {
                name: "Cash",
                currentPrice: 1,
                time: new Date().getTime(),
                assetType: AssetType.Cash
            },
            ...LivePriceDataService.callableAssets
        }
    }

    async findOne(id: number) {
        const asset = await this.em.findOne(Asset, id);
        if (!asset) {
            throw new HttpException(
                `Asset with id ${id} not found.`,
                HttpStatus.NOT_FOUND,
            );
        }
        return {
            symbol: asset.ticker_symbol,
            ...LivePriceDataService.callableAssets[asset.ticker_symbol],
        };
    }

    //   update(id: number, updatePriceDatumDto: UpdatePriceDatumDto) {
    //     return `This action updates a #${id} priceDatum`;
    //   }

    //   remove(id: number) {
    //     return `This action removes a #${id} priceDatum`;
    //   }
}
