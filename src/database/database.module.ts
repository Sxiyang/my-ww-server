import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get<string>('DB_TYPE', 'mongodb');
        if (dbType == 'mongodb') {
          return {
            type: 'mongodb',
            uri: configService.get<string>('MONGODB_URI'),
          };
        } else if (dbType == 'postgres') {
          return {
            type: 'postgres',
            host: configService.get<string>('POSTGRES_HOST'),
            port: configService.get<number>('POSTGRES_PORT'),
            database: configService.get<string>('POSTGRES_DB'),
          };
        }
        throw new Error(`不支持的数据库类型${dbType}`);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
