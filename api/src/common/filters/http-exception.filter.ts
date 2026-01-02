import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error: { code: string; message: string; details?: any } = {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        
        // Check if it's already in our format
        if (responseObj.error && responseObj.error.code) {
          error = responseObj.error;
        } else if (responseObj.code) {
          // Custom exception with code
          error = {
            code: responseObj.code,
            message: responseObj.message || exception.message,
            details: responseObj.details,
          };
        } else {
          // Standard NestJS exception
          error = {
            code: exception.name || 'HTTP_EXCEPTION',
            message: responseObj.message || exception.message,
            details: Array.isArray(responseObj.message) ? responseObj.message : undefined,
          };
        }
      } else {
        error = {
          code: 'HTTP_EXCEPTION',
          message: String(exceptionResponse),
        };
      }
    } else if (exception instanceof Error) {
      error = {
        code: 'INTERNAL_ERROR',
        message: exception.message,
      };
    }

    response.status(status).json({
      ok: false,
      error,
    });
  }
}


