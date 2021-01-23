import axios from 'axios';
import * as cheerio from 'cheerio';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Gold as GoldModel } from './gold/gold.model';
import { DXY as DXYModel } from './dxy/dxy.model';
import { Oil as OilModel } from './oil/oil.model';
import { Silver as SilverModel } from './silver/silver.model';
import { Copper as CopperModel } from './copper/copper.model';

class GeneralDataInterface {
  date: String;
  price: Number;
}

const investingComFetch = async (curr_id: string, smlID: string, header: string, startDate: string, endDate: string) => {
  const data = [];

  const params = new URLSearchParams();
  params.append('curr_id', curr_id);
  params.append('smlID', smlID);
  params.append('header', header);
  params.append('st_date', startDate);
  params.append('end_date', endDate);
  params.append('interval_sec', 'Daily');
  params.append('sort_col', 'date');
  params.append('sort_ord', 'DESC');
  params.append('action', 'historical_data');

  const page = await axios({
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': 'Mozilla/5.0',
      'x-requested-with': 'XMLHttpRequest'
    },
    data: params,
    url: 'https://www.investing.com/instruments/HistoricalDataAjax'
  });

  const $ = cheerio.load(page.data);

  $('tbody').each((tbodyIndex, record) => {
    if (tbodyIndex === 0) {
      $(record).find('tr').each((_, row) => {
        let dailyRecord: any = {};
        
        $(row).find('td').each((index, d) => {
          if (index === 0) {
            dailyRecord.date = $(d).text();
          }
          if (index === 1) {
            dailyRecord.price = parseFloat($(d).text().replace(/\,/g, ''));
          }
        });

        data.push(dailyRecord);
      });
    }
  });

  return data;
}

@Injectable()
export class GeneralService {
  constructor(
    @InjectModel('gold')
    private readonly goldModel: Model<GoldModel>,

    @InjectModel('oil')
    private readonly oilModel: Model<OilModel>,

    @InjectModel('copper')
    private readonly copperModel: Model<CopperModel>,

    @InjectModel('silver')
    private readonly silverModel: Model<SilverModel>,

    @InjectModel('dxy')
    private readonly dxyModel: Model<DXYModel>
  ) {}

  async getDXYValue(): Promise<String> {
    const dxyPage = await axios.get('https://www.marketwatch.com/investing/index/dxy');
    const $ = cheerio.load(dxyPage.data);
    
    const lastQuote = $('bg-quote[field="Last"]').text();

    const lastQuoteTime = $('bg-quote[field="date"]').text() + "EST";

    const intraDayChange = $($('bg-quote[field="change"]').toArray()[6]).text();

    const intraDayPercentageChange = $($('bg-quote[field="percentchange"]').toArray()[12]).text();

    const result = {
      last_quote: lastQuote,
      last_quote_time: lastQuoteTime,
      intra_day_change: intraDayChange,
      intra_day_percentage_change: intraDayPercentageChange
    }
    return JSON.stringify(result);
  }

  async listDXYValue(): Promise<DXYModel[]> {
    return await this.dxyModel.find({}, { '_id': 0 });
  }

  async listOilValue(): Promise<OilModel[]> {
    return await this.oilModel.find({}, { '_id': 0 });
  }

  async listGoldValue(): Promise<GoldModel[]> {
    return await this.goldModel.find({}, { '_id': 0 });
  }

  async listSilverValue(): Promise<SilverModel[]> {
    return await this.silverModel.find({}, { '_id': 0 });
  }

  async listCopperValue(): Promise<CopperModel[]> {
    return await this.copperModel.find({}, { '_id': 0 });
  }

  async fetchAndUpdate(startDate: string, endDate: string): Promise<any> {
    const goldData = await investingComFetch('8830', '300004', 'Gold Futures Historical Data', startDate, endDate);
    const dxyData = await investingComFetch('8827', '400001', 'US Dollar Index Futures Historical Data', startDate, endDate);
    const crudeOilData = await investingComFetch('8849', '300060', 'Crude Oil WTI Futures Historical Data', startDate, endDate);
    const copperData = await investingComFetch('8831', '300012', 'Copper Futures Historical Data', startDate, endDate);
    const silverData = await investingComFetch('8836', '300044', 'Silver Futures Historical Data', startDate, endDate);

    await this.goldModel.insertMany(goldData);
    await this.dxyModel.insertMany(dxyData);
    await this.oilModel.insertMany(crudeOilData);
    await this.copperModel.insertMany(copperData);
    await this.silverModel.insertMany(silverData);

    return 'Successfully updated.';
  }
}
