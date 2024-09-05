import { Injectable } from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor {
  intercept(context, next) {
    console.log('Before...');

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
