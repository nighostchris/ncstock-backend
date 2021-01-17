import * as moment from 'moment';
import * as yahooFinance from 'yahoo-finance';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { SNPBreadth } from './snpBreadth.model';
import { SNPCompaniesService } from 'src/snp_companies/snpCompanies.service';

// class SNPBreadthInterface {
//   date: String
//   communication: Number
//   consumer_discretionary: Number
//   consumer_staples: Number
//   energy: Number
//   financials: Number
//   health_care: Number
//   industrials: Number
//   materials: Number
//   real_estate: Number
//   technology: Number
//   utilities: Number
// }

const industryMapping = new Map([
  ['Communication Services', 'communication'],
  ['Consumer Discretionary', 'consumer_discretionary'],
  ['Consumer Staples', 'consumer_staples'],
  ['Energy', 'energy'],
  ['Financials', 'financials'],
  ['Health Care', 'health_care'],
  ['Industrials', 'industrials'],
  ['Materials', 'materials'],
  ['Real Estate', 'real_estate'],
  ['Information Technology', 'technology'],
  ['Utilities', 'utilities']
]);

const proportionOfGreaterThan20MAByIndustry = async (tickers: Array<String>): Promise<number> => {
  const stockDetails = await yahooFinance.historical({
    symbols: tickers,
    from: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD'),
  });

  console.log(moment().format('YYYY-MM-DD'));

  const isGreaterThan20MAList = Object.keys(stockDetails).map((ticker) => {
    const targetTickerDetails = stockDetails[ticker];
    const currentPrice = targetTickerDetails[0].close;
    const priceOfLast20Days = targetTickerDetails.slice(0, 20).map((p) => Number(p.close));
    const averagePriceFor20Days = priceOfLast20Days.reduce((acc, current) => acc + current) / 20;
    return currentPrice > averagePriceFor20Days;
  });

  return Number(isGreaterThan20MAList.filter(Boolean).length / Object.keys(stockDetails).length * 100);
}

@Injectable()
export class SNPBreadthService {
  constructor(
    @InjectModel('snp_breadth')
    private readonly breadthModel: Model<SNPBreadth>,
    private readonly companyService: SNPCompaniesService
  ) {}

  async getAll(): Promise<SNPBreadth[]> {
    return await this.breadthModel.find({}, { '_id': 0 });
  }

  async fetchAndUpdate(): Promise<String> {
    const result = { date: moment().format('YYYY-MM-DD') };
    const snpCompanies = await this.companyService.getAll();
    const industryList = [...new Set(snpCompanies.map((c) => c.industry.replace(/\n/g, '')))];

    for (let industry of industryList) {
      const constitutes = snpCompanies.filter((c) => c.industry === industry);
      
      const proportionGreaterThan20MA = await proportionOfGreaterThan20MAByIndustry(constitutes.map((c) => c.ticker));

      result[industryMapping.get(industry)] = Math.ceil(proportionGreaterThan20MA);
    };

    const newBreadth = new this.breadthModel(result);
    
    await newBreadth.save();

    return JSON.stringify(result);
  }
}
