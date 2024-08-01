import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { DataResponse } from '../types/http/response.types';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const errorResponse: DataResponse<null> = {
      data: null,
      message: "an error occurred",
      errors: exception.message,
    };

    response
      .status(status)
      .json(errorResponse);
  }
}