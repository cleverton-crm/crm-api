import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import * as Sentry from '@sentry/node';

Sentry.init({
    dsn: 'http://4a76f9f4b1244722ad719a4dd78e754a@log.cleverton.ru:9000/2',
});

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        if (exception instanceof HttpException) {
            return response.status(status).json(exception.getResponse());
        }

        Sentry.captureException(exception);

        response.status(status).json({
            statusCode: status,
            message: 'There are some problems with the modules. Check ports and addresses',
            error: 'Microservice Error',
        });
    }
}
