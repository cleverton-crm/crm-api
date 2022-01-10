import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { cyan } from 'cli-color';
import { ClientProxy } from '@nestjs/microservices';
import { SendAndResponseData } from '../helpers/global';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  private logger: Logger;

  constructor(
    @Inject('FILES_SERVICE')
    private readonly filesServiceClient: ClientProxy,
  ) {
    this.logger = new Logger(FilesController.name);
  }

  @Get('/')
  @Auth('Admin', 'Manager')
  async getList(): Promise<any> {
    const response = await SendAndResponseData(
      this.filesServiceClient,
      'files:list',
      {},
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }
}
