import { Controller, Get, Post } from '@nestjs/common';
import { SNPBreadthService } from './snpBreadth.service';

@Controller('snp/breadth')
export class SNPBreadthController {
  constructor(private service: SNPBreadthService) {}

  @Get('list')
  async list(): Promise<Array<any>> {
    return await this.service.getAll();
  }

  @Get('update')
  async update(): Promise<String> {
    return await this.service.fetchAndUpdate();
  }
}