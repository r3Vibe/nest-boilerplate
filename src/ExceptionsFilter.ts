import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { CustomLoggerService } from './custom-logger/custom-logger.service';

type ResponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new CustomLoggerService();

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const ResponseObj: ResponseObj = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    if (exception instanceof HttpException) {
      ResponseObj.statusCode = exception.getStatus();
      ResponseObj.response = exception.getResponse();
    } else if (exception instanceof Error) {
      // prisma client validation error
      ResponseObj.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      ResponseObj.response = exception.message.replaceAll(/\n/g, ' ');
    } else {
      ResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      ResponseObj.response = 'Internal Server Error';
    }

    response.status(ResponseObj.statusCode).json(ResponseObj);
    this.logger.error(ResponseObj.response, AllExceptionFilter.name);

    super.catch(exception, host);
  }
}
