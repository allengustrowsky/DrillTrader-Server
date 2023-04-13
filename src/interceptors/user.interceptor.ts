import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// thanks to bing chat for most of this code
@Injectable()
export class RemovePortfilioPropsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        delete data["portfolio"]["transactions"]
        delete data["portfolio"]["portfolioAssets"]
        delete data["portfolio"]["portfolioValues"]
        delete data["portfolio"]["user"]
        return data;
      }),
    );
  }
}