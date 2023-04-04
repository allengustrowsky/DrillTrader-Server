import { PartialType } from '@nestjs/mapped-types';
import { CreatePortfolioValueDto } from './create-portfolio_value.dto';

export class UpdatePortfolioValueDto extends PartialType(
    CreatePortfolioValueDto,
) {}
