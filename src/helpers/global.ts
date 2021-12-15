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
export const SendAndResponseData = async (
  client: ClientProxy,
  pattern: string,
  data: any,
) => {
  const userResponse = await firstValueFrom(client.send(pattern, data));
  console.log(userResponse);
  if (userResponse.statusCode !== HttpStatus.OK) {
    if (userResponse.statusCode === undefined) {
      throw new HttpException(
        {
          statusCode: userResponse.statusCode,
          message: userResponse.message,
          errors: userResponse.errors,
        },
        userResponse.statusCode,
      );
    }
    // throw new HttpException(
    //   {
    //     statusCode: userResponse.statusCode,
    //     message: userResponse.message,
    //     errors: userResponse.errors,
    //   },
    //   userResponse.statusCode,
    // );
  }

  return userResponse;
};
