import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import { cyan } from 'cli-color';
import { firstValueFrom } from 'rxjs';
import { ProfileDto } from '../dto/profile.dto';
import { SendAndResponseData } from '../helpers/global';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  private logger: Logger;
  constructor(
    @Inject('PROFILE_SERVICE')
    private readonly profileServiceClient: ClientProxy,
  ) {
    this.logger = new Logger(ProfileController.name);
    console.log(this.profileServiceClient);
  }

  @Post('/')
  @ApiOperation({
    summary: 'Создание профиля пользователя',
    description: fs.readFileSync('docs/profile/create.md').toString(),
  })
  async createPersona(@Body() profileData: ProfileDto) {
    const response = SendAndResponseData(
      this.profileServiceClient,
      'profile:persona',
      profileData,
    );
    this.logger.log(cyan(response));
    return response;
  }
}
