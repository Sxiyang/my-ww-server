import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export interface ResponseFormat<T = any> {
  code: number;
  message: string;
  data: T | null;
  timestamp: string;
  path: string;
}
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ResponseFormat<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data) => {
        if (data === null || data === undefined) {
          return {
            code: HttpStatus.OK,
            message: '操作成功',
            data: null,
            timestamp: new Date().toISOString(),
            path: request.url,
          };
        }
        if (data && typeof data === 'object' && 'code' in data && 'message' in data) {
          const responseData = data as { code?: unknown; message?: unknown };
          return {
            code: responseData.code as number,
            message: (responseData.message as string) || '操作成功',
            data,
            timestamp: new Date().toISOString(),
            path: request.url,
          };
        }
        return {
          code: HttpStatus.OK,
          message: '操作成功',
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }
}
