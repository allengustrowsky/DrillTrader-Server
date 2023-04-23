import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/mysql';

/**
 * Checks to ensure user is an admin. Assumes user is already attached to request object.
 */
@Injectable()
export class IsAdminGuard implements CanActivate {
    constructor(private readonly em: EntityManager) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        if (!request.user.is_admin) {
            throw new HttpException(
                'Method not allowed!',
                HttpStatus.FORBIDDEN,
            );
        }

        return true;
    }
}
