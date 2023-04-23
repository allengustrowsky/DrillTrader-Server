import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { EntityManager } from '@mikro-orm/mysql';

// adapted from nestjs documentation on implementing an authentication guard
/**
 * Ensures user submits a valid apiKey, and if so then attaches the user to
 * the request object.
 */
@Injectable()
export class ApiAuthGuard implements CanActivate {
    constructor(private readonly em: EntityManager) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // grab apiKey in header
        const [apiKey] = request.headers.authorization?.split(' ') ?? [];
        console.log(`type: ${typeof apiKey}`);
        if (apiKey !== undefined) {
            // see if there's a user with that apiKey
            const user = await this.em.find(User, { apiKey: apiKey });
            if (user.length !== 0) {
                // TODO: attach user to request object
                request.user = user[0];
            } else {
                // bad apiKey
                throw new HttpException(
                    'Unauthorized!',
                    HttpStatus.UNAUTHORIZED,
                );
            }
        } else {
            throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED);
        }

        return true;
    }
}
