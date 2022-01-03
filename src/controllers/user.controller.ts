import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
import { cyan } from 'cli-color';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  RefreshAccessTokenDto,
  RefreshTokenDto,
  UserChangePasswordDto,
  UserDto,
  UserForgotPasswordDto,
  UserResetPasswordDto,
  UserResponseTokensDto,
  UsersListDto,
} from '../dto/user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { IpAddress } from '../decorators/ip.decorator';
import { Core } from 'crm-core';
import { Roles } from '../decorators/roles.decorator';
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

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  /** Registration */
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  @Post('/registration')
  @ApiOperation({
    summary: 'Sing up User in to application',
    description: Core.OperationReadMe('docs/users/register.md'),
  })
  async registration(@Body() userData: UserDto): Promise<any> {
    const response = await SendAndResponseData(
      this.userServiceClient,
      'user:register',
      userData,
    );
    this.logger.log(cyan(`Registered user ${response}`));
    return response;
  }

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  /** Login */
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  @Post('/login')
  @ApiOperation({
    summary: 'Sing in User in application',
    description: Core.OperationReadMe('docs/users/login.md'),
  })
  async login(@Body() userData: UserDto): Promise<UserResponseTokensDto> {
    userData['type'] = 'users';
    const response = await SendAndResponseData(
      this.userServiceClient,
      'user:login',
      userData,
    );

    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  /** Email verify */
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  @Get('/verify')
  @ApiOperation({
    summary: 'User verification using a link to email',
    description: Core.OperationReadMe('docs/users/verify.md'),
  })
  async verificationUser(@Query('secretKey') secretKey: string) {
    const response = await SendAndResponseData(
      this.userServiceClient,
      'user:verify',
      secretKey,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  /** Forgot Password */
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  @Patch('/password/forgot')
  @ApiOperation({
    summary: 'Step 1: Forgotten password recovery',
    description: Core.OperationReadMe('docs/users/forgot_password.md'),
  })
  async forgotPassword(
    @IpAddress() ip: Core.Geo.Location,
    @Body() userData: UserForgotPasswordDto,
  ) {
    const response = await SendAndResponseData(
      this.userServiceClient,
      'password:forgot',
      { ...userData, ...ip },
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  /** Password refresh verify */
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  @Patch('/password/refresh/verify')
  @ApiOperation({
    summary: 'Refresh request link for reset password',
    description: Core.OperationReadMe('docs/users/refresh_verify.md'),
  })
  async refreshVerify(@Body() userData: UserForgotPasswordDto) {
    const response = await SendAndResponseData(
      this.userServiceClient,
      'password:refreshverify',
      userData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  /** Password forgot verify */
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  @Patch('/password/forgot/verify')
  @ApiOperation({
    summary: 'Step 2: User verification using a link to email. ',
    description: Core.OperationReadMe('docs/users/forgot_verify.md'),
  })
  @ApiQuery({ type: String, name: 'verification', required: true })
  async forgotVerify(@Query('verification') userData: string) {
    const response = await SendAndResponseData(
      this.userServiceClient,
      'password:forgotverify',
      { verification: userData },
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  /** Password reset */
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  @Patch('/password/reset')
  @ApiOperation({
    summary: 'Step 3: User reset password. ',
    description: Core.OperationReadMe('docs/users/password_reset.md'),
  })
  @ApiResponse({ type: UserResetPasswordDto, status: HttpStatus.OK })
  async resetPassword(@Body() userData: UserResetPasswordDto) {
    const response = await SendAndResponseData(
      this.userServiceClient,
      'password:reset',
      userData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  /** Change password */
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  @Patch('/change/password')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change password',
    description: Core.OperationReadMe('docs/users/change_password.md'),
  })
  @ApiResponse({ type: UserChangePasswordDto, status: HttpStatus.OK })
  async changePassword(
    @Body() userData: UserChangePasswordDto,
    @Req() req: any,
  ) {
    const changeData = Object.assign(userData, req.user);
    const response = await SendAndResponseData(
      this.userServiceClient,
      'password:change',
      changeData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  /** Create user  */
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  @Post('/create')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiResponse({ type: UserDto, status: HttpStatus.OK })
  @ApiOperation({
    summary: 'User creation',
    description: Core.OperationReadMe('docs/users/create.md'),
  })
  async createUser(@Body() userData: UserDto): Promise<any> {
    const response = await SendAndResponseData(
      this.userServiceClient,
      'user:create',
      userData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  @Post('/refresh-access-token')
  @UseGuards(RolesGuard, AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtaining an access token in the presence of a refresh token',
  })
  @ApiResponse({ status: HttpStatus.OK, type: RefreshAccessTokenDto })
  async refreshAccessToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshAccessTokenDto> {
    const response = await SendAndResponseData(
      this.userServiceClient,
      'user:refresh:token',
      refreshTokenDto,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  /** Get all users */
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  @Get('/')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'List of all users',
    description: Core.OperationReadMe('docs/users/find_all.md'),
  })
  async findAllUsers(): Promise<UsersListDto> {
    const response = await SendAndResponseData(
      this.userServiceClient,
      'user:list',
      true,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  /** Get User ID */
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiParam({ name: 'id', type: 'string' })
  @ApiQuery({ name: 'active', type: 'boolean', enum: ['true', 'false'] })
  @ApiOperation({
    summary: 'User archiving',
    description: Core.OperationReadMe('docs/users/archive.md'),
  })
  async archiveUser(
    @Param('id') id: string,
    @Req() req: any,
    @Query('active') active: boolean,
  ): Promise<Core.Response.Success> {
    const sendData = {
      id: id,
      request: req?.user,
      active: active,
    };
    console.log(sendData);
    const response = await SendAndResponseData(
      this.userServiceClient,
      'user:archive',
      sendData,
    );
    this.logger.log(cyan(JSON.stringify(response)));
    return response;
  }
}
