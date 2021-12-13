import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from './services/config.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './services/jwt.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { RolesController } from './controllers/roles.controller';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProfileController } from './controllers/profile.controller';

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
  controllers: [UserController, RolesController, ProfileController],
  providers: [
    ConfigService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
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
  ],
})
export class AppModule {}
