import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

export const fileImagesOptions = {
  limits: {
    fileSize: 2512000,
  },

  fileFilter: (req: any, file: any, callback: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      callback(null, true);
    } else {
      callback(
        new HttpException(
          {
            statusCode: 400,
            message: `Unsupported file type ${extname(file.originalname)}`,
            errors: 'Bad File',
          },
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
};
