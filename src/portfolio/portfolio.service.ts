import { EntityManager } from '@mikro-orm/mysql';
import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { Portfolio } from './entities/portfolio.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class PortfolioService {
    constructor(private readonly em: EntityManager) {}

    // create(createPortfolioDto: CreatePortfolioDto) {
    //     return 'This action adds a new portfolio';
    // }

    async findAll() {
        const portfolios = await this.em.find(Portfolio, {});
        return portfolios;
    }

    async findOne(id: number, request: Request) {
        const portfolio = await this.em.findOne(Portfolio, id);
        if (!portfolio) {
            throw new NotFoundException(`Portfolio with id ${id} not found.`);
        }

        const isAuthorized =
            portfolio.user.id === (request as any).user.id ||
            (request as any).user.is_admin;
        if (!isAuthorized) {
            throw new HttpException(
                'You are not allowed to access this portfolio!',
                HttpStatus.FORBIDDEN,
            );
        }

        return portfolio;
    }

    // update(id: number, updatePortfolioDto: UpdatePortfolioDto) {
    //     return `This action updates a #${id} portfolio`;
    // }

    async remove(id: number) {
        const portfolio = await this.em.findOne(Portfolio, id);
        if (portfolio) {
            await this.em.remove(portfolio).flush();
            return portfolio;
        } else {
            throw new NotFoundException(`Portfolio with id ${id} not found`);
        }
    }
}
