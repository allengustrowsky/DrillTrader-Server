import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException, } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { User } from "src/user/entities/user.entity";
import { EntityManager } from '@mikro-orm/mysql';

// adapted from nestjs documentation on implementing an authentication guard
@Injectable()
export class ApiAuthGuard implements CanActivate  {
    constructor(private readonly em: EntityManager) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // grab apiKey in header
        const [apiKey] = request.headers.authorization?.split(' ') ?? [];
        console.log(`type: ${typeof apiKey}`)
        if (apiKey !== undefined) {
            // see if there's a user with that apiKey
            const user = await this.em.find(User, { apiKey: apiKey });
            if (user.length !== 0) {
                // TODO: attach user to request object 

                console.log(user)
            } else { // bad apiKey
                throw new HttpException("Unauthorized!", HttpStatus.UNAUTHORIZED)
            }
        } else {
            throw new HttpException("Unauthorized!", HttpStatus.UNAUTHORIZED)
        }
        
        return true;
    }
}