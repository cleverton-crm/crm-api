import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
import { RolesDto } from '../dto/roles.dto';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  private logger: Logger;
  constructor(
    @Inject('ROLES_SERVICE') private readonly rolesServiceClient: ClientProxy,
  ) {
    this.logger = new Logger(RolesController.name);
  }

  @Post('/create')
  @ApiOperation({
    summary: 'Creating role for user',
    description: fs.readFileSync('docs/roles/create.md').toString(),
  })
  async create(@Body() rolesData: RolesDto) {
    const rolesResponse = await firstValueFrom(
      this.rolesServiceClient.send('roles:create', rolesData),
    );
    if (rolesResponse.statusCode !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          statusCode: rolesResponse.statusCode,
          message: rolesResponse.message,
          errors: rolesResponse.errors,
        },
        rolesResponse.statusCode,
      );
    }
    return rolesResponse;
  }
}
