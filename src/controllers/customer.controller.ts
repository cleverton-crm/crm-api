import {Controller, Get} from '@nestjs/common';

@Controller()
export class CustomerController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'hi';
  }
}
