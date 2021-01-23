import { Module } from '@nestjs/common';
import { GeneralService } from './General.service';
import { GeneralController } from './General.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GoldSchema } from './gold/gold.schema';
import { DXYSchema } from './dxy/dxy.schema';
import { OilSchema } from './oil/oil.schema';
import { SilverSchema } from './silver/silver.schema';
import { CopperSchema } from './copper/copper.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: 'gold',
      schema: GoldSchema,
      collection: 'gold'
    }, {
      name: 'dxy',
      schema: DXYSchema,
      collection: 'dxy'
    }, {
      name: 'oil',
      schema: OilSchema,
      collection: 'oil'
    }, {
      name: 'silver',
      schema: SilverSchema,
      collection: 'silver'
    }, {
      name: 'copper',
      schema: CopperSchema,
      collection: 'copper'
    }])
  ],
  controllers: [GeneralController],
  providers: [GeneralService],
  exports: [GeneralService]
})

export class GeneralModule {}
