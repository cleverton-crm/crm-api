import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from './services/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //app.use(helmet());
  //app.enableCors();

  app.useGlobalPipes(new ValidationPipe());
  const configService = new ConfigService();
  const config = new DocumentBuilder()
    .setTitle('Cleverdeus microservices')
    .setDescription(fs.readFileSync('./docs/api.md').toString())
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('REST API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(configService.get('port'), () => {
    if (typeof process.send === 'function') {
      process.send('ready');
    }
  });
}
bootstrap();
