import { JwtOptionsFactory, JwtModuleOptions } from '@nestjs/jwt';

export class JwtConfigService implements JwtOptionsFactory {
  createJwtOptions(): JwtModuleOptions {
    console.log(process.env.JWT_SECRET);
    return {
      secret: process.env.JWT_SECRET,
    };
  }
}
