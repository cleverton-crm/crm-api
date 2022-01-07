import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { v4 as uuid, v5 as uuidv5 } from 'uuid';

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
