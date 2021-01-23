import { Controller, Get, Post, Query } from '@nestjs/common';
import { GeneralService } from './general.service';

@Controller('general')
export class GeneralController{
  constructor(private service: GeneralService) {}

  @Get('/dxy')
  async getDXY(): Promise<String> {
    return await this.service.getDXYValue();
  }

  @Get('/dxy/list')
  async getDXYList(): Promise<Array<any>> {
    return await this.service.listDXYValue();
  }

  @Get('/copper/list')
  async getCopperList(): Promise<Array<any>> {
    return await this.service.listCopperValue();
  }

  @Get('/silver/list')
  async getSilverList(): Promise<Array<any>> {
    return await this.service.listSilverValue();
  }

  @Get('/oil/list')
  async getOilList(): Promise<Array<any>> {
    return await this.service.listOilValue();
  }

  @Get('/gold/list')
  async getGoldList(): Promise<Array<any>> {
    return await this.service.listGoldValue();
  }

  @Post('/update')
  async update(@Query() query): Promise<String> {
    console.log(query);
    return await this.service.fetchAndUpdate(query.start_date, query.end_date);
  }
}
