import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { promises } from 'fs';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from './services/config/config.service';
import { cyan } from 'cli-color';
import { join } from 'path';

let app: INestApplication;

const logger = new Logger('NestApplication');

async function bootstrap() {
  app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(helmet());

  const pkg = JSON.parse(await promises.readFile(join('.', 'package.json'), 'utf8'));

  app.useGlobalPipes(new ValidationPipe());
  //app.useGlobalFilters(new HttpExceptionFilter());
  const logger = new Logger('NestApplication');
  const configService = new ConfigService();
  const config = new DocumentBuilder()
    .setTitle('Logistic CRM')
    .setDescription(fs.readFileSync('./docs/api.md').toString())
    .setVersion(pkg.version)
    .addBearerAuth()
    .addTag('REST API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableShutdownHooks();
  //fs.writeFileSync('./public/swagger-spec.json', JSON.stringify(document));
  await app.listen(configService.get('port'), () => {
    logger.log(cyan(`Started application listening on port ${configService.get('port')}`));
    if (typeof process.send === 'function') {
      process.send('ready');
    }
  });
}

bootstrap().catch((error: unknown) => {
  logger.error('Start application failed! ' + error);
});

async function gracefulShutdown(): Promise<void> {
  if (app !== undefined) {
    await app.close();
    logger.warn('Application closed!');
  }
  process.exit(0);
}

process.once('SIGTERM', async () => {
  logger.error('SIGTERM: Graceful shutdown... ');
  await gracefulShutdown();
});

process.once('SIGINT', async () => {
  logger.error('SIGINT: Graceful shutdown... ');
  await gracefulShutdown();
});
