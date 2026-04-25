import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  userId: number;
  username: string;
  roles?: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET') || 'test-secret-key', // 密钥
      ignoreExpiration: false,
    });
  }
  validate(payload: JwtPayload) {
    if (!payload.userId) {
      throw new UnauthorizedException('Token无效');
    }
    return {
      userId: payload.userId,
      username: payload.username,
      roles: payload.roles || ['user'],
    };
  }
}
