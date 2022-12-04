/* eslint-disable prettier/prettier */
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
// import { createReadStream } from 'fs';
import { AppService } from './app.service';
import { createReadStream } from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@Res() response: Response) {
    const frontEndSrc = `./src/static-html/index.html`;
    const htmlStream = createReadStream(frontEndSrc);
    return htmlStream.pipe(response);
  }
}
