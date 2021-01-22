import { Module } from '@nestjs/common';
import { GeneralService } from './General.service';
import { GeneralController } from './General.controller';

@Module({
  controllers: [GeneralController],
  providers: [GeneralService],
  exports: [GeneralService]
})

export class GeneralModule {}
