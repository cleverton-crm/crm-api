import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

export const fileOptions = {
    // limits: {
    //     fileSize: 15512000,
    // },

    fileFilter: (req: any, file: any, callback: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|doc|docx|odt|txt|csv|xls|xlsx|pdf|rtf|ppt)$/)) {
            console.log(file);
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
