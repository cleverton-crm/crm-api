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
  Req,
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
  UserResetPasswordDto,
} from '../dto/user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import * as fs from 'fs';
import { IpAddress } from '../decorators/ip.decorator';
import { Core } from 'core-types';
import { SendAndResponseData } from '../helpers/global';

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
    const response = SendAndResponseData(
      this.userServiceClient,
      'user:register',
      userData,
    );
    this.logger.log(cyan(`Registered user ${response}`));
    return response;
  }

  @Post('/login')
  @ApiOperation({
    summary: 'Sing in User in application',
    description: fs.readFileSync('docs/users/login.md').toString(),
  })
  async login(@Body() userData: UserDto): Promise<UserResponseTokensDto> {
    userData['type'] = 'users';
    const response = SendAndResponseData(
      this.userServiceClient,
      'user:login',
      userData,
    );

    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/verify')
  @ApiOperation({
    summary: 'User verification using a link to email',
    description: fs.readFileSync('docs/users/verify.md').toString(),
  })
  async verificationUser(@Query('secretKey') secretKey: string) {
    const response = SendAndResponseData(
      this.userServiceClient,
      'user:verify',
      secretKey,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/password/forgot')
  @ApiOperation({
    summary: 'Step 1: Forgotten password recovery',
    description: fs.readFileSync('docs/users/forgot_password.md').toString(),
  })
  async forgotPassword(
    @IpAddress() ip: Core.Geo.Location,
    @Body() userData: UserForgotPasswordDto,
  ) {
    const response = SendAndResponseData(
      this.userServiceClient,
      'password:forgot',
      { ...userData, ...ip },
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/password/refresh/verify')
  @ApiOperation({
    summary: 'Refresh request link for reset password',
    description: fs.readFileSync('docs/users/refresh_verify.md').toString(),
  })
  async refreshVerify(@Body() userData: UserForgotPasswordDto) {
    const response = SendAndResponseData(
      this.userServiceClient,
      'password:refreshverify',
      userData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Get('/password/forgot/verify')
  @ApiOperation({
    summary: 'Step 2: User verification using a link to email. ',
    description: fs.readFileSync('docs/users/forgot_verify.md').toString(),
  })
  async forgotVerify(@Query('userData') userData: UserForgotVerifyLinkDto) {
    const response = SendAndResponseData(
      this.userServiceClient,
      'password:forgotverify',
      userData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Patch('/password/reset')
  @ApiOperation({
    summary: 'Step 3: User reset password. ',
    description: fs.readFileSync('docs/users/password_reset.md').toString(),
  })
  @ApiResponse({ type: UserResetPasswordDto, status: HttpStatus.OK })
  async resetPassword(@Body() userData: UserResetPasswordDto) {
    return userData;
  }

  @Patch('/change/password')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change password',
    description: fs.readFileSync('docs/users/change_password.md').toString(),
  })
  @ApiResponse({ type: UserChangePasswordDto, status: HttpStatus.OK })
  async changePassword(
    @Body() userData: UserChangePasswordDto,
    @Req() req: any,
  ) {
    const changeData = Object.assign(userData, req.user);
    const response = SendAndResponseData(
      this.userServiceClient,
      'password:change',
      changeData,
    );
    this.logger.log(cyan(response));
    return response;
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
    const response = SendAndResponseData(
      this.userServiceClient,
      'user:create',
      userData,
    );
    this.logger.log(cyan(response));
    return response;
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
