import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Core } from 'crm-core';
import { cyan } from 'cli-color';
import { CompanyDto } from '../dto/company.dto';
import { ListSettingsDto, SettingsDto } from '../dto/settings.dto';
import { SendAndResponseData } from '../helpers/global';

@ApiTags('Settings')
@Controller('settings')
export class SettingController {
  private logger: Logger;

  constructor(
    @Inject('SETTINGS_SERVICE')
    private readonly settingServiceClient: ClientProxy,
  ) {
    this.logger = new Logger(SettingController.name);
  }

  /**
   * Определение настроек
   * @param settingDto
   */
  @Post('/')
  @ApiOperation({
    summary: 'Указание настройки',
    description: Core.OperationReadMe('docs/settings/set.md'),
  })
  @ApiResponse({ type: SettingsDto, status: HttpStatus.OK })
  async set(@Body() settingDto: SettingsDto): Promise<Core.Response.Answer> {
    const response = await SendAndResponseData(
      this.settingServiceClient,
      'setting:set',
      settingDto,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  /**
   * Определение настроек
   * @param name
   * @param type
   * @param obj
   * @param property
   */
  @Get('/')
  @ApiOperation({
    summary: 'Указание настройки',
    description: Core.OperationReadMe('docs/settings/set.md'),
  })
  @ApiResponse({ type: ListSettingsDto, status: HttpStatus.OK })
  @ApiNotFoundResponse({
    description: 'Not found',
    status: HttpStatus.NOT_FOUND,
  })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'property', required: false })
  @ApiQuery({
    name: 'type',
    enum: ['string', 'number', 'array', 'boolean', 'map'],
    required: false,
  })
  @ApiQuery({
    name: 'object',
    enum: [
      'users',
      'roles',
      'profiles',
      'company',
      'clients',
      'cars',
      'holdings',
      'mail',
    ],
    required: false,
  })
  async get(
    @Query('name') name: string,
    @Query('type') type: string,
    @Query('object') obj: string,
    @Query('property') property: string,
  ): Promise<Core.Response.Answer> {
    let settingDto = {
      name: name,
      type: type,
      object: obj,
      property: property,
    };

    const response = await SendAndResponseData(
      this.settingServiceClient,
      'setting:get',
      settingDto,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }
  /**
   * Определение настроек
   * @param name
   * @param type
   * @param obj
   * @param property
   */
  @Get('/list')
  @ApiOperation({
    summary: 'Указание настройки',
    description: Core.OperationReadMe('docs/settings/set.md'),
  })
  @ApiResponse({ type: ListSettingsDto, status: HttpStatus.OK })
  @ApiNotFoundResponse({
    description: 'Not found',
    status: HttpStatus.NOT_FOUND,
  })
  @ApiQuery({
    name: 'type',
    enum: ['string', 'number', 'array', 'boolean', 'map'],
    required: false,
  })
  @ApiQuery({
    name: 'object',
    enum: [
      'users',
      'roles',
      'profiles',
      'company',
      'clients',
      'cars',
      'holdings',
      'mail',
    ],
    required: false,
  })
  async list(
    @Query('type') type: string,
    @Query('object') obj: string,
  ): Promise<Core.Response.Answer> {
    let settingDto = {
      type: type,
      object: obj,
    };

    const response = await SendAndResponseData(
      this.settingServiceClient,
      'setting:list',
      settingDto,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }
}
