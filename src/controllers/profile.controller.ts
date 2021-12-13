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
  async createProfile(@Body() profileData: ProfileDto) {
    console.log(profileData);
    const profileResponse = await firstValueFrom(
      this.profileServiceClient.send('profile:create', profileData),
    );
    if (profileResponse.statusCode !== HttpStatus.OK) {
      throw new HttpException(
        {
          statusCode: profileResponse.statusCode,
          message: profileResponse.message,
          errors: profileResponse.errors,
        },
        profileResponse.statusCode,
      );
    }
    this.logger.log(cyan(`Registered user ${profileResponse}`));
    return profileResponse;
  }
}
