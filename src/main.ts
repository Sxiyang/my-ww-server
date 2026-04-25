import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动移除DTO中没有声明的字段
      forbidNonWhitelisted: true, // 有未声明的字段时，抛出错误
      transform: true, // 自动类型转换
      transformOptions: {
        enableImplicitConversion: true, // 允许隐式转换
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error('Error starting application:', error);
  process.exit(1);
});
