import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { cyan } from 'cli-color';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  UserUpdateDto,
  UserDto,
  UsersListDto,
  UserForgotPasswordDto,
  UserForgotVerifyLinkDto,
  UserChangePasswordDto,
  UserResponseTokensDto,
} from '../dto/user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import * as fs from 'fs';
import { Roles } from '../decorators/roles.decorator';
import { ResponseSuccessData } from 'src/helpers/global';

@ApiTags('User')
@Controller('users')
export class UserController {
  private logger: Logger;
  constructor(
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {
    this.logger = new Logger(UserController.name);
  }

  @Post('/registration')
  @ApiOperation({
    summary: 'Sing up User in to application',
    description: fs.readFileSync('docs/users/register.md').toString(),
  })
  async registration(@Body() userData: UserDto): Promise<any> {
    const userResponse = await firstValueFrom(
      this.userServiceClient.send('user:register', userData),
    );
    if (userResponse.statusCode !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          statusCode: userResponse.statusCode,
          message: userResponse.message,
          errors: userResponse.errors,
        },
        userResponse.statusCode,
      );
    }
    this.logger.log(cyan(userResponse));
    return userResponse;
  }

  @Post('/login')
  @ApiOperation({
    summary: 'Sing in User in application',
    description: fs.readFileSync('docs/users/login.md').toString(),
  })
  async login(@Body() userData: UserDto): Promise<UserResponseTokensDto> {
    userData['type'] = 'users';
    const userResponse = await firstValueFrom(
      this.userServiceClient.send('user:login', userData),
    );
    if (userResponse.statusCode !== HttpStatus.OK) {
      throw new HttpException(
        {
          statusCode: userResponse.statusCode,
          message: userResponse.message,
          errors: userResponse.errors,
        },
        userResponse.statusCode,
      );
    }
    this.logger.log(cyan(JSON.stringify(userResponse)));
    return userResponse;
  }

  @Get('/verify')
  @ApiOperation({
    summary: 'User verification using a link to email',
    description: fs.readFileSync('docs/users/verify.md').toString(),
  })
  async verificationUser(@Query('secretKey') secretKey: string) {
    return secretKey;
  }

  @Patch('/password/forgot')
  @ApiOperation({
    summary: 'Step 1: Forgotten password recovery',
    description: fs.readFileSync('docs/users/forgot_password.md').toString(),
  })
  async forgotPassword(@Body() userData: UserForgotPasswordDto) {
    return userData;
  }

  @Get('/password/forgot/verify')
  @ApiOperation({
    summary: 'Step 2: User verification using a link to email. ',
    description: fs.readFileSync('docs/users/forgot_verify.md').toString(),
  })
  async forgotVerify(@Query('userData') userData: UserForgotVerifyLinkDto) {
    return userData;
  }

  @Patch('/password/reset')
  @ApiOperation({
    summary: 'Step 3: User reset password. ',
    description: fs.readFileSync('docs/users/password_reset.md').toString(),
  })
  @ApiResponse({ type: UserForgotPasswordDto, status: HttpStatus.OK })
  async resetPassword(@Body() userData: UserForgotPasswordDto) {
    return userData;
  }

  @Patch('/password/change')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Customer')
  @ApiOperation({
    summary: 'Change password',
    description: fs.readFileSync('docs/users/change_password.md').toString(),
  })
  @ApiResponse({ type: UserChangePasswordDto, status: HttpStatus.OK })
  async changePassword(@Body() userData: UserChangePasswordDto) {
    return userData;
  }

  @Post('/create')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiResponse({ type: UserDto, status: HttpStatus.OK })
  @ApiOperation({
    summary: 'User verification using a link to email',
    description: fs.readFileSync('docs/users/password_reset.md').toString(),
  })
  async createUser(@Body() userData: UserDto): Promise<UserDto> {
    const userResponse = await firstValueFrom(
      this.userServiceClient.send('user:create', userData),
    );
    if (userResponse.statusCode !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          statusCode: userResponse.statusCode,
          message: userResponse.message,
          errors: userResponse.errors,
        },
        userResponse.statusCode,
      );
    }
    this.logger.log(cyan(userResponse));
    return userResponse;
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() userData: UserUpdateDto,
  ): Promise<UserUpdateDto> {
    const sendData = {
      userId: id,
      data: userData,
    };
    const userResponse = await firstValueFrom(
      this.userServiceClient.send('user:update', sendData),
    );
    return userResponse;
  }

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  async findAllUsers(): Promise<UsersListDto> {
    const usersResponse = await firstValueFrom(
      this.userServiceClient.send('user:list', true),
    );
    return usersResponse;
  }
}
