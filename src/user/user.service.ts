import { EntityManager } from '@mikro-orm/mysql';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { Portfolio } from '../portfolio/entities/portfolio.entity';

@Injectable()
export class UserService {
    constructor(private readonly em: EntityManager) {}

    async create(createUserDto: CreateUserDto) {
        const user = new User(createUserDto)
        const portfolio = new Portfolio();
        user.portfolio = portfolio;

        try {
            await this.em.persistAndFlush(user);
            await this.em.persistAndFlush(portfolio);
        } catch (e) {
            if (e instanceof UniqueConstraintViolationException) {
                throw new HttpException("Email must be unique", HttpStatus.BAD_REQUEST)
            } else {
                throw new HttpException("An error occurred!", HttpStatus.CONFLICT)
            }
        }
        
        return user;
    }

    async findAll() {
        const users = await this.em.find(User, {});
        return users;
    }

    async findOne(id: number) {
        const user = await this.em.findOne(User, id)
        if (!user) {
            throw new NotFoundException()
        }
        return user
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
