import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { cyan } from 'cli-color';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());
  //app.useGlobalFilters(new HttpExceptionFilter());
  const logger = new Logger('NestApplication');
  const configService = new ConfigService();
  const config = new DocumentBuilder()
    .setTitle('Logistic CRM')
    .setDescription(fs.readFileSync('./docs/api.md').toString())
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('REST API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //fs.writeFileSync('./public/swagger-spec.json', JSON.stringify(document));
  await app.listen(configService.get('port'), () => {
    logger.log(cyan(`Started listening on port ${configService.get('port')}`));
    if (typeof process.send === 'function') {
      process.send('ready');
    }
  });
}
bootstrap();
