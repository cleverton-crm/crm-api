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
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { cyan } from 'cli-color';
import {
  ProfilePersonaDto,
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
   * Персональные данные
   * @param req
   */
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

  /**
   * Загрузка аватара или фотографии
   * @param file
   * @param req
   */
  @Post('/me/avatar/upload')
  @Auth('Admin', 'Manager')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Загрузка фото или аватар пользователя',
    description: Core.OperationReadMe('docs/profile/avatar.md'),
  })
  @ApiUnauthorizedResponse({
    type: ResponseUnauthorizedDto,
    status: HttpStatus.UNAUTHORIZED,
    description: 'Требуется авторизация',
  })
  @ApiResponse({ type: ResponseSuccessDto, status: HttpStatus.OK })
  @UseInterceptors(FilesInterceptor('file', 10, fileImagesOptions))
  async upload(@UploadedFiles() file, @Req() req: any): Promise<any> {
    const response = [];
    file.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        id: file.id,
        filename: file.filename,
        metadata: file.metadata,
        bucketName: file.bucketName,
        chunkSize: file.chunkSize,
        size: file.size,
        md5: file.md5,
        uploadDate: file.uploadDate,
        contentType: file.contentType,
      };
      response.push(file);
    });
    const sendData = { userID: req.user.userID, files: response };
    const responseData = await SendAndResponseData(
      this.filesServiceClient,
      'files:avatar',
      sendData,
    );
    this.logger.log(cyan(responseData));
    return responseData;
  }

  /**
   * Получение аватара по авторизации
   * @param req
   */
  @Get('/me/avatar')
  @ApiOperation({
    summary: 'Фото или аватар пользователя',
    description: Core.OperationReadMe('docs/profile/avatar.md'),
  })
  @Auth('Admin', 'Manager')
  @ApiResponse({ type: ResponseSuccessDto, status: HttpStatus.OK })
  @ApiUnauthorizedResponse({
    type: ResponseUnauthorizedDto,
    status: HttpStatus.UNAUTHORIZED,
  })
  async showAvatar(
    @Req() req: any,
  ): Promise<Core.Response.Answer | Core.Response.Error> {
    const sendData = { id: req.user.userID };
    const responseData = await SendAndResponseData(
      this.filesServiceClient,
      'files:avatar:show',
      sendData,
    );
    this.logger.log(cyan(responseData));
    return responseData;
  }

  /**
   * Обновление данных в профиле по ID
   * @param id
   * @param profileData
   */
  @Patch('/me/update')
  @ApiOperation({
    summary: 'Обновление данных',
    description: Core.OperationReadMe('docs/profile/update.md'),
  })
  @Auth('Admin')
  @ApiResponse({ type: ProfilePersonaDto, status: HttpStatus.OK })
  async update(@Req() req: any, @Body() profileData: ProfilePersonaDto) {
    profileData.id = req.user.userID;
    const response = await SendAndResponseData(
      this.profileServiceClient,
      'profile:update',
      profileData,
    );
    this.logger.log(cyan(response));
    return response;
  }

  /**
   * Обновление данных в профиле по ID
   * @param id
   * @param profileData
   */
  @Patch('/:id/update')
  @ApiOperation({
    summary: 'Обновление данных',
    description: Core.OperationReadMe('docs/profile/update.md'),
  })
  @Auth('Admin')
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
   * <<<<<<<<<<<<<<<<<<<<
   * Обновление или добавление информации о месте проживания
   * <<<<<<<<<<<<<<<<<<<<
   * @param id
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
   * <<<<<<<<<<<<<<<<<<<<
   * Обновление или замена фотографии пользователя
   * <<<<<<<<<<<<<<<<<<<<
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
}
