import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { StockController } from './controllers/stock.controller';
import { SNPCompaniesModule } from './snp_companies/snpCompanies.module';

@Module({
  imports: [
    SNPCompaniesModule,
    MongooseModule.forRoot('mongodb+srv://admin:nighostchris@cluster0.2fhts.azure.mongodb.net/data?retryWrites=true&w=majority')
  ],
  controllers: [AppController, StockController],
  providers: [AppService],
})

export class AppModule {}
