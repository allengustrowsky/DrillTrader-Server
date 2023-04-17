import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// thanks to bing chat for most of this code
@Injectable()
export class RemoveAssetPTInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        delete data["transactions"]
        delete data["portfolio_assets"]
        return data;
      }),
    );
  }
}