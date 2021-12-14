import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';

export const ResponseSuccessData = (message: string) => {
  return {
    statusCode: 200,
    message: message,
    status: true,
  };
};
export const UserResponseDataToServer = async (
  client: ClientProxy,
  pattern: string,
  data: any,
) => {
  const userResponse = await firstValueFrom(client.send(pattern, data));
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
  return userResponse;
};
