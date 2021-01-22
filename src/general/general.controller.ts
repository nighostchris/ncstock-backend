import { Controller, Get } from '@nestjs/common';
import { GeneralService } from './general.service';

@Controller('general')
export class GeneralController{
  constructor(private service: GeneralService) {}

  @Get('/dxy')
  async getDXY(): Promise<String> {
    return await this.service.getDXYValue();
  }
}