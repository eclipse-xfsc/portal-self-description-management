import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("description")
  async getDescription(@Query('did') did: string): Promise<string> {
    return await this.appService.getDescription(did);
  }

  @Get("isAlive")
  async getAlive() {
    return "OK"
  }
}
