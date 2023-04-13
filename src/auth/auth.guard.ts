import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

@Injectable()
export class ApiAuthGuard implements CanActivate  {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        // if they have an apikey in header, 
            // if user
                // attach user to request object 
            // else throw 401 (UnauthorizedException())
        // else hrow 401 (UnauthorizedException())

        console.log('apiAuthGuard')

        // await null;
        return true;
    }
}