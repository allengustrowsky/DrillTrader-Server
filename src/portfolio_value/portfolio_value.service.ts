import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePortfolioValueDto } from './dto/create-portfolio_value.dto';
import { UpdatePortfolioValueDto } from './dto/update-portfolio_value.dto';
import { PortfolioValue } from './entities/portfolio_value.entity';

@Injectable()
export class PortfolioValueService {
    constructor(private readonly em: EntityManager) {}

    // create(createPortfolioValueDto: CreatePortfolioValueDto) {
    //     return 'This action adds a new portfolioValue';
    // }

    async findAll(userId: number, request: Request) {
        // make sure user can manage portfolio
        const isAuthorized =
            userId === (request as any).user.id ||
            (request as any).user.is_admin;
        if (!isAuthorized) {
            throw new HttpException(
                "You are not allowed to access the value of this user's portfolio.",
                HttpStatus.FORBIDDEN,
            );
        }

        const portfolioValues = await this.em.find(PortfolioValue, {
            portfolio: userId,
        });
        return portfolioValues;
    }

    async findOne(portfolioId: number, request: Request) {
        const isAuthorized =
            portfolioId === (request as any).user.id ||
            (request as any).user.is_admin;
        if (!isAuthorized) {
            throw new HttpException(
                "You are not allowed to access this the value of this user's portfolio.",
                HttpStatus.FORBIDDEN,
            );
        }

        const portValue = await this.em.find(
            PortfolioValue,
            { portfolio: portfolioId },
            { limit: 1, orderBy: { created_at: 'desc' } },
        );
        if (portValue.length > 0) {
            return portValue[0];
        } else {
            throw new HttpException(
                'No portfolio value has been recorded for this portfolio.',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    // update(id: number, updatePortfolioValueDto: UpdatePortfolioValueDto) {
    //     return `This action updates a #${id} portfolioValue`;
    // }

    // remove(id: number) {
    //     return `This action removes a #${id} portfolioValue`;
    // }
}
