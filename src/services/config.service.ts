import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly config: { [key: string]: any } = null;

  constructor() {
    this.config = {};
    this.config.port = process.env.API_GATEWAY_PORT;
    this.config.userService = {
      options: {
        port: process.env.USER_SERVICE_PORT,
        host: process.env.USER_SERVICE_HOST,
      },

      transport: Transport.TCP,
    };
    this.config.profileService = {
      options: {
        port: process.env.PROFILE_SERVICE_PORT,
        host: process.env.PROFILE_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
    this.config.rolesService = {
      options: {
        port: process.env.USER_SERVICE_PORT,
        host: process.env.USER_SERVICE_HOST,
      },

      transport: Transport.TCP,
    };
    this.config.companyService = {
      options: {
        port: process.env.COMPANY_SERVICE_PORT,
        host: process.env.COMPANY_SERVICE_HOST,
      },

      transport: Transport.TCP,
    };

    this.config.JwtService = {
      options: {
        secret: process.env.JWT_SECRET,
      },
      transport: Transport.TCP,
    };
  }

  get(key: string): any {
    return this.config[key];
  }
}
