import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { cyan } from 'cli-color';
import { ProfilePersonaDto } from '../dto/profile.dto';
import { Core } from 'crm-core';
import { SendAndResponseData } from '../helpers/global';
import { Auth } from '../decorators/auth.decorator';

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
  @Auth('Admin', 'Manager')
  @ApiResponse({ type: ProfilePersonaDto, status: HttpStatus.OK })
  async createPersona(
    @Body() profileData: ProfilePersonaDto,
  ): Promise<Core.Response.Answer> {
    const response = await SendAndResponseData(
      this.profileServiceClient,
      'profile:empty',
      profileData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/:id/update')
  @ApiOperation({
    summary: 'Фото или аватар пользователя',
    description: Core.OperationReadMe('docs/profile/update.md'),
  })
  @Auth('Admin', 'Manager')
  @ApiResponse({ type: ProfilePersonaDto, status: HttpStatus.OK })
  async updatePersona(
    @Param('id') id: string,
    @Body() profileData: ProfilePersonaDto,
  ) {
    profileData.id = id;
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
  @Patch('/:id/update/location')
  @ApiOperation({
    summary: 'Данные о месте проживания',
    description: Core.OperationReadMe('docs/profile/location.md'),
  })
  @Auth('Admin', 'Manager')
  @ApiResponse({ type: ProfilePersonaDto, status: HttpStatus.OK })
  async insertOrUpdateAddressPersona(
    @Param('id') id: string,
    @Body() profileData: ProfilePersonaDto,
  ) {
    profileData.id = id;
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
  @Patch('/:id/update/avatar')
  @ApiOperation({
    summary: 'Фото или аватар пользователя',
    description: Core.OperationReadMe('docs/profile/avatar.md'),
  })
  @Auth('Admin', 'Manager')
  @ApiResponse({ type: ProfilePersonaDto, status: HttpStatus.OK })
  async updateAvatarPersona(
    @Param('id') id: string,
    @Body() profileData: ProfilePersonaDto,
  ) {
    profileData.id = id;
    const response = await SendAndResponseData(
      this.profileServiceClient,
      'profile:avatar',
      profileData,
    );
    this.logger.log(cyan(response));
    return response;
  }

  @Patch('/:id/update/socials')
  @ApiOperation({
    summary: 'Социальные сети пользователя',
    description: Core.OperationReadMe('docs/profile/social.md'),
  })
  @ApiResponse({ type: ProfilePersonaDto, status: HttpStatus.OK })
  @Auth('Admin', 'Manager')
  async updateSocialPersona(
    @Param('id') id: string,
    @Body() profileData: ProfilePersonaDto,
  ) {
    profileData.id = id;
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
    description: Core.OperationReadMe('docs/profile/profile.md'),
  })
  @Auth('Admin', 'Manager')
  @ApiResponse({ type: ProfilePersonaDto, status: HttpStatus.OK })
  async myDataPersona(@Req() req: any) {
    const sendData = { id: req.user.userID };
    const response = await SendAndResponseData(
      this.profileServiceClient,
      'profile:me',
      sendData,
    );
    this.logger.log(cyan(response));
    return response;
  }
}
