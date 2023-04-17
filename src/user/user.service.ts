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
                throw new HttpException("Email must be unique.", HttpStatus.BAD_REQUEST)
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

    async update(id: number, updateUserDto: UpdateUserDto, request: Request) {
        let user = await this.em.findOne(User, id);
        if (!user) {
            throw new NotFoundException();
        }

        const isAuthorized = user.id === (request as any).user || (request as any).user.is_admin
        if (!isAuthorized) {
            throw new HttpException('You are not allowed to modify this user!', HttpStatus.UNAUTHORIZED);
        }

        if (updateUserDto.first_name) {
            user.first_name = updateUserDto.first_name
        }
        if (updateUserDto.last_name) {
            user.last_name = updateUserDto.last_name
        }
        if (updateUserDto.email_address) {
            user.email_address = updateUserDto.email_address
        }

        try {
            await this.em.persistAndFlush(user);
        } catch (e) {
            if (e instanceof UniqueConstraintViolationException) {
                throw new HttpException("This email has already been taken.", HttpStatus.BAD_REQUEST)
            } else {
                throw new HttpException("An error occurred!", HttpStatus.CONFLICT)
            }
        }

        return user;
    }

    async remove(id: number) {
        const user = await this.em.findOne(User, id);

        if (user) {
            await this.em.remove(user).flush();
            return user;
        } else {
            throw new HttpException(`User with id ${id} does not exist!`, HttpStatus.BAD_REQUEST);
        }
    }
}
