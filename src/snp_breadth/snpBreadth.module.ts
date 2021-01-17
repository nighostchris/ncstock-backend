import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SNPBreadthService } from './snpBreadth.service';
import { SNPBreadthController } from './snpBreadth.controller';
import { SNPBreadthSchema } from './snpBreadth.schema';
import { SNPCompaniesModule } from 'src/snp_companies/snpCompanies.module';

@Module({
  imports: [
    SNPCompaniesModule,
    MongooseModule.forFeature([{
      name: 'snp_breadth',
      schema: SNPBreadthSchema,
      collection: 'snp_breadth'
    }])
  ],
  controllers: [SNPBreadthController],
  providers: [SNPBreadthService],
  exports: [SNPBreadthService]
})

export class SNPBreadthModule {}
