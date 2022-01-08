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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { cyan } from 'cli-color';
import {
  ProfilePersonaDto,
  ResponseNotFoundDto,
  ResponseSuccessDto,
  ResponseUnauthorizedDto,
} from '../dto';
import { Core } from 'crm-core';
import { SendAndResponseData } from '../helpers/global';
import { Auth } from '../decorators/auth.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileImagesOptions } from '../helpers/file-images-options';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  private logger: Logger;

  constructor(
    @Inject('PROFILE_SERVICE')
    private readonly profileServiceClient: ClientProxy,
    @Inject('FILES_SERVICE')
    private readonly filesServiceClient: ClientProxy,
  ) {
    this.logger = new Logger(ProfileController.name);
  }

  /**
   * Создание профиля пользователя
   * @param profileData
   */
  @Post('/')
  @Auth('Admin', 'Manager')
  @ApiOperation({
    summary: 'Создание профиля пользователя',
    description: Core.OperationReadMe('docs/profile/create.md'),
  })
  @ApiResponse({ type: ProfilePersonaDto, status: HttpStatus.OK })
  async createPersona(
    @Body() profileData: ProfilePersonaDto,
    @Req() req: any,
  ): Promise<Core.Response.Answer> {
    profileData.id = req.user.userID;
    const response = await SendAndResponseData(
      this.profileServiceClient,
      'profile:new',
      profileData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /**
   * Обновление данных в профиле по ID
   * @param id
   * @param profileData
   */
  @Get('/:id')
  @ApiOperation({
    summary: 'Получение одного профиля пользователя',
    description: Core.OperationReadMe('docs/profile/update.md'),
  })
  @Auth('Admin')
  @ApiResponse({ type: ProfilePersonaDto, status: HttpStatus.OK })
  @ApiUnauthorizedResponse({
    type: ResponseUnauthorizedDto,
    status: HttpStatus.UNAUTHORIZED,
  })
  @ApiNotFoundResponse({
    type: ResponseNotFoundDto,
    status: HttpStatus.NOT_FOUND,
  })
  async getProfile(@Param('id') id: string): Promise<Core.Profiles.Schema> {
    const sendData = { id: id };
    const response = await SendAndResponseData(
      this.profileServiceClient,
      'profile:get:id',
      sendData,
    );
    this.logger.log(cyan(response));
    return response;
  }

  /**
   * Обновление данных в профиле по ID
   */
  @Get('/')
  @ApiOperation({
    summary: 'Получить все профили',
    description: Core.OperationReadMe('docs/profile/update.md'),
  })
  @Auth('Admin')
  @ApiResponse({ type: ResponseSuccessDto, status: HttpStatus.OK })
  @ApiUnauthorizedResponse({
    type: ResponseUnauthorizedDto,
    status: HttpStatus.UNAUTHORIZED,
  })
  @ApiNotFoundResponse({
    type: ResponseNotFoundDto,
    status: HttpStatus.NOT_FOUND,
  })
  async getProfiles() {
    const response = await SendAndResponseData(
      this.profileServiceClient,
      'profile:get:all',
      {},
    );
    this.logger.log(cyan(response));
    return response;
  }
}
