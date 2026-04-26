import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ExceptionResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

interface ErrorResponse {
  code: number;
  message: string;
  data: null;
  timestamp: string;
  path: string;
  error?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = '服务器内部错误';
    let error: string | null = null;
    // 处理 HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as ExceptionResponse;
        message = Array.isArray(responseObj.message)
          ? responseObj.message[0]
          : responseObj.message || '请求失败';
        error = responseObj.error || null;
      }
    }
    // 处理其他异常
    else if (exception instanceof Error) {
      message = exception.message || '服务器内部错误';
      this.logger.error(
        `未处理的异常：${exception.message}`,
        exception.stack,
        'AllExceptionsFilter',
      );
    }
    // 记录异常日志
    this.logger.error(`${request.method} ${request.url} ${status} ${message}`);
    // 返回统一格式的错误响应
    const errorResponse: ErrorResponse = {
      code: status,
      message: message,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (error) {
      errorResponse.error = error;
    }
    response.status(status).json(errorResponse);
  }
}
