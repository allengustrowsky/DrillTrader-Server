import { EntityManager } from '@mikro-orm/mysql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(private readonly em: EntityManager) {}

    async create(createUserDto: CreateUserDto) {
        const user = new User(createUserDto)
        await this.em.persistAndFlush(user)
        return user;
    }

    findAll() {
        return `This action returns all user`;
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
