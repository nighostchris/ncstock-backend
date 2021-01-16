import { Controller, Get, Post, Body } from '@nestjs/common';
import { SNPCompaniesService } from './snpCompanies.service';

@Controller('snp')
export class SNPCompaniesController{
  constructor(private service: SNPCompaniesService) {}

  @Get('list')
  async list(): Promise<Array<any>> {
    return await this.service.getAll();
  }

  @Post('update')
  async update(): Promise<String> {
    return await this.service.fetchAndUpdate();
  }

  @Post('add')
  async addNewCompany(@Body() company: any) {
    return await this.service.add(company);
  }
}