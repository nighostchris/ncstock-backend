import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SNPCompaniesService } from './snpCompanies.service';
import { SNPCompaniesController } from './snpCompanies.controller';
import { SNPCompaniesSchema } from '../snp_companies/snpCompanies.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: 'snp_companies',
      schema: SNPCompaniesSchema,
      collection: 'snp_companies'
    }])
  ],
  controllers: [SNPCompaniesController],
  providers: [SNPCompaniesService],
  exports: [SNPCompaniesService]
})

export class SNPCompaniesModule {}
