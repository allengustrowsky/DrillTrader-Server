import { EntityManager } from '@mikro-orm/mysql';
import { Injectable } from '@nestjs/common';
import { CreatePortfolioValueDto } from './dto/create-portfolio_value.dto';
import { UpdatePortfolioValueDto } from './dto/update-portfolio_value.dto';

@Injectable()
export class PortfolioValueService {
    constructor(private readonly em: EntityManager) {}

    create(createPortfolioValueDto: CreatePortfolioValueDto) {
        return 'This action adds a new portfolioValue';
    }

    findAll() {
        return `This action returns all portfolioValue`;
    }

    findOne(id: number) {
        return `This action returns a #${id} portfolioValue`;
    }

    update(id: number, updatePortfolioValueDto: UpdatePortfolioValueDto) {
        return `This action updates a #${id} portfolioValue`;
    }

    remove(id: number) {
        return `This action removes a #${id} portfolioValue`;
    }
}
