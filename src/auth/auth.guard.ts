import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization;
    if (!token) {
      return false; // 未授权
    }
    return this.validateToken(token);
  }
  private validateToken(token: string): boolean {
    // 验证token
    return token.startsWith('Bearer ');
  }
}
