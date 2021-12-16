import { Logger } from '@nestjs/common';
import * as fs from 'fs';

export const ReadmeDescription = (path: string): string => {
  const logger = new Logger('ProfileController');
  let reamMeFile;
  try {
    reamMeFile = fs.readFileSync(path).toString();
  } catch (e) {
    logger.error(`Не найден путь к файлу [ ${path} ]`);
  }

  return reamMeFile;
};
