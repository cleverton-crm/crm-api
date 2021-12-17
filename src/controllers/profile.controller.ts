import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Logger,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { cyan } from 'cli-color';
import { ProfilePersonaDto } from '../dto/profile.dto';
import { SendAndResponseData } from '../helpers/global';
import { ReadmeDescription } from '../helpers/readme';
import { Core } from 'micro-core';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  private logger: Logger;

  constructor(
    @Inject('PROFILE_SERVICE')
    private readonly profileServiceClient: ClientProxy,
  ) {
    this.logger = new Logger(ProfileController.name);
  }

  /**
   * Создание профиля пользователя
   * @param profileData
   */
  @Post('/')
  @ApiOperation({
    summary: 'Создание профиля пользователя',
    description: Core.OperationReadMe('docs/profile/create.md'),
  })
  @ApiResponse({ type: ProfilePersonaDto, status: HttpStatus.OK })
  async createPersona(
    @Body() profileData: ProfilePersonaDto,
  ): Promise<Core.Response.Answer> {
    const response = await Core.SendAndResponse(
      this.profileServiceClient,
      'profile:empty',
      profileData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/me/update')
  @ApiOperation({
    summary: 'Фото или аватар пользователя',
    description: Core.OperationReadMe('docs/profile/update.md'),
  })
  @ApiResponse({ type: ProfilePersonaDto, status: HttpStatus.OK })
  async updatePersona(@Body() profileData: ProfilePersonaDto) {
    const response = await SendAndResponseData(
      this.profileServiceClient,
      'profile:update',
      profileData,
    );
    this.logger.log(cyan(response));
    return response;
  }

  /**
   * Обновление или добавление информации о месте проживания
   * @param profileData
   */
  @Patch('/me/update/location')
  @ApiOperation({
    summary: 'Данные о месте проживания',
    description: Core.OperationReadMe('docs/profile/location.md'),
  })
  @ApiResponse({ type: ProfilePersonaDto, status: HttpStatus.OK })
  async insertOrUpdateAddressPersona(@Body() profileData: ProfilePersonaDto) {
    const response = await SendAndResponseData(
      this.profileServiceClient,
      'profile:address',
      profileData,
    );
    this.logger.log(cyan(response));
    return response;
  }

  /**
   * Обновление или замена фотографии пользователя
   * @param profileData
   */
  @Patch('/me/update/avatar')
  @ApiOperation({
    summary: 'Фото или аватар пользователя',
    description: ReadmeDescription('docs/profile/avatar.md'),
  })
  @ApiResponse({ type: ProfilePersonaDto, status: HttpStatus.OK })
  async updateAvatarPersona(@Body() profileData: ProfilePersonaDto) {
    const response = await SendAndResponseData(
      this.profileServiceClient,
      'profile:avatar',
      profileData,
    );
    this.logger.log(cyan(response));
    return response;
  }

  @Patch('/me/update/socials')
  @ApiOperation({
    summary: 'Социальные сети пользователя',
    description: ReadmeDescription('docs/profile/social.md'),
  })
  @ApiResponse({ type: ProfilePersonaDto, status: HttpStatus.OK })
  async updateSocialPersona(@Body() profileData: ProfilePersonaDto) {
    const response = await SendAndResponseData(
      this.profileServiceClient,
      'profile:address',
      profileData,
    );
    this.logger.log(cyan(response));
    return response;
  }

  @Get('/me')
  @ApiOperation({
    summary: 'Данные пользователя',
    description: ReadmeDescription('docs/profile/profile.md'),
  })
  @ApiResponse({ type: ProfilePersonaDto, status: HttpStatus.OK })
  async myDataPersona(@Body() profileData: ProfilePersonaDto) {
    const response = await SendAndResponseData(
      this.profileServiceClient,
      'profile:address',
      profileData,
    );
    this.logger.log(cyan(response));
    return response;
  }
}
