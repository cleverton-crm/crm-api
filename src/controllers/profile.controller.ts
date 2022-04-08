import { Body, Controller, Get, HttpStatus, Inject, Logger, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { cyan } from 'cli-color';
import { ProfilePersonaDto, ResponseNotFoundDto, ResponseSuccessDto, ResponseUnauthorizedDto } from '../dto';
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
    @Inject('FILES_SERVICE')
    private readonly filesServiceClient: ClientProxy,
  ) {
    this.logger = new Logger(ProfileController.name);
  }

  /**
   * Создание профиля пользователя
   * @param profileData
   * @param req
   */
  @Post('/create')
  @Auth('Admin', 'Manager')
  @ApiOperation({
    summary: 'Создание профиля пользователя',
    description: Core.OperationReadMe('docs/profile/create.md'),
  })
  @ApiResponse({ type: ProfilePersonaDto, status: HttpStatus.OK })
  async createPersona(@Body() profileData: ProfilePersonaDto, @Req() req: any): Promise<Core.Response.Answer> {
    profileData.id = req.user.userID;
    const response = await SendAndResponseData(this.profileServiceClient, 'profile:new', profileData);
    return response;
  }

  @Get('/')
  @ApiOperation({
    summary: 'Получение профилей пользователей',
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
  async getProfilesList(): Promise<Core.Profiles.Schema> {
    const response = await SendAndResponseData(this.profileServiceClient, 'profile:get:all', true);
    return response;
  }

  /**
   * Обновление данных в профиле по ID
   * @param id
   */
  @Get('/:id')
  @ApiOperation({
    summary: 'Получение одного профиля пользователя',
    description: Core.OperationReadMe('docs/profile/update.md'),
  })
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
    const response = await SendAndResponseData(this.profileServiceClient, 'profile:get:id', sendData);
    return response;
  }

  /**
   * Обновление данных в профили
   */
  @Get('/list/active')
  @ApiOperation({
    summary: 'Получить все активные профили',
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
    const response = await SendAndResponseData(this.profileServiceClient, 'profile:get:all', {});
    return response;
  }

  /**
   * Обновление данных в профили
   */
  @Get('/list/archive')
  @ApiOperation({
    summary: 'Получить профили из архива',
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
  async getProfilesArchive() {
    const response = await SendAndResponseData(this.profileServiceClient, 'profile:get:archive', {});
    return response;
  }

  /**
   * Обновление данных в профиле по ID
   * @param id
   * @param profileData
   */
  @Patch('/:id/update')
  @ApiOperation({
    summary: 'Обновление данных профиля',
    description: Core.OperationReadMe('docs/profile/update.md'),
  })
  @Auth('Admin')
  @ApiResponse({ type: ProfilePersonaDto, status: HttpStatus.OK })
  async update(@Param('id') id: string, @Body() profileData: ProfilePersonaDto) {
    profileData.id = id;
    const response = await SendAndResponseData(this.profileServiceClient, 'profile:update', profileData);
    return response;
  }

  /**
   *  по ID
   * @param status
   * @param id
   */
  @Patch('/:id/status')
  @ApiOperation({
    summary: 'Активирование, архивирование и блокировка профиля',
    description: Core.OperationReadMe('docs/profile/update.md'),
  })
  @ApiQuery({ name: 'status', enum: ['active', 'inactive', 'banned'] })
  @Auth('Admin')
  @ApiResponse({ type: ProfilePersonaDto, status: HttpStatus.OK })
  async blockProfile(@Query('status') status: string, @Param('id') id: string) {
    const sendData = { id: id, status: status };
    const response = await SendAndResponseData(this.profileServiceClient, 'profile:status', sendData);
    return response;
  }
}
