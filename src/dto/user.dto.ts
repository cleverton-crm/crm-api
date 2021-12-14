import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
  @ApiProperty({
    example: 'test@cleverdeus.com',
    format: 'email',
    uniqueItems: true,
    minLength: 5,
    maxLength: 255,
  })
  @MinLength(5)
  @MaxLength(255)
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password',
    format: 'string',
    minLength: 5,
    maxLength: 16,
  })
  password: string;
}
export class UserUpdateDto {
  @ApiProperty({
    example: 'password',
    format: 'string',
    minLength: 5,
    maxLength: 16,
  })
  password: string;
}

export class UserForgotPasswordDto {
  @ApiProperty({
    example: 'test@cleverdeus.com',
    format: 'email',
    uniqueItems: true,
    minLength: 5,
    maxLength: 255,
  })
  @MinLength(5)
  @MaxLength(255)
  @IsEmail()
  email: string;
}

export class UserResponseTokensDto {
  accessToken: string;
  refreshToken: string;
}

export class UserChangePasswordDto {
  @ApiProperty({ format: 'string', minLength: 5, maxLength: 16 })
  @IsString()
  @IsNotEmpty()
  password: string;
  @ApiProperty({ format: 'string', minLength: 5, maxLength: 16 })
  @IsString()
  @IsNotEmpty()
  password_new: string;
  @ApiProperty({ format: 'string', minLength: 5, maxLength: 16 })
  @IsString()
  @IsNotEmpty()
  password_confirm: string;
}

export class UserForgotVerifyLinkDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  verification: string;
}

export class UsersListDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  id?: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  roles: string[];
}
