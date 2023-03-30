import { PartialType } from '@nestjs/mapped-types';
import { CreatePortfolioAssetDto } from './create-portfolio_asset.dto';

export class UpdatePortfolioAssetDto extends PartialType(CreatePortfolioAssetDto) {}
