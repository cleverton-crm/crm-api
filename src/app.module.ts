import { Module } from '@nestjs/common';
import {
  ClientController,
  CompanyController,
  DealsController,
  FilesController,
  ProfileController,
  ProfileControllerMe,
  RolesController,
  SettingController,
  UserController,
} from './controllers';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from './services/config/config.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './services/config/jwt.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CarsController } from './controllers/cars.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', './public'),
      exclude: ['/v2*', '/api*'],
    }),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],

  controllers: [
    UserController,
    RolesController,
    ProfileController,
    ProfileControllerMe,
    CompanyController,
    ClientController,
    CarsController,
    DealsController,
    FilesController,
    SettingController,
  ],
  providers: [
    ConfigService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: 'FILES_SERVICE',
      useFactory: (configService: ConfigService) => {
        const filesServiceOptions = configService.get('filesService');
        return ClientProxyFactory.create(filesServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'USER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const userServiceOptions = configService.get('userService');
        return ClientProxyFactory.create(userServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'ROLES_SERVICE',
      useFactory: (configService: ConfigService) => {
        const rolesServiceOptions = configService.get('rolesService');
        return ClientProxyFactory.create(rolesServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'PROFILE_SERVICE',
      useFactory: (configService: ConfigService) => {
        const profileServiceOptions = configService.get('profileService');
        return ClientProxyFactory.create(profileServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'COMPANY_SERVICE',
      useFactory: (configService: ConfigService) => {
        const companyServiceOptions = configService.get('companyService');
        return ClientProxyFactory.create(companyServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'SETTINGS_SERVICE',
      useFactory: (configService: ConfigService) => {
        const settingServiceOptions = configService.get('settingService');
        return ClientProxyFactory.create(settingServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
