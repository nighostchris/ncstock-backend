import axios from 'axios';
import * as moment from 'moment';
import * as cheerio from 'cheerio';
import * as yahooFinance from 'yahoo-finance';
import { Controller, Get, Param } from '@nestjs/common';

@Controller()
export class StockController {
  @Get('/stock/:id')
  async getDetails(@Param() params): Promise<Array<any>> {
    const stockDetails = await yahooFinance.historical({
      symbol: params.id,
      from: moment('20210116').subtract(30, 'days').format('YYYY-MM-DD'),
      to: '2021-01-16',
    });

    console.log(stockDetails);

    //const currentPrice = stockDetails[0].close;
    const currentPrice = 1;
    const priceOfLast20Days = stockDetails.slice(0, 20).map((p) => Number(p.close));
    const averagePriceFor20Days = priceOfLast20Days.reduce((acc, current) => acc + current) / 20;

    return [currentPrice, averagePriceFor20Days, currentPrice > averagePriceFor20Days];
  }

  @Get('/stocks/snp')
  async getSNPCompanies(): Promise<any> {
    const wikiPage = await axios.get('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies');
    const $ = cheerio.load(wikiPage.data);
    let result = [];

    $('table#constituents').each((_, e) => {
      $(e).find('tbody').each((_, company) => {
        let ticker = '';
        let industry = '';
        
        $(company).find('tr').each((_, companyRow) => {
          $(companyRow).find('td').each((index, companyDetails) => {
            if (index % 9 === 0) {
              ticker = $(companyDetails).text();
            }
            if (index % 9 === 3) {
              industry = $(companyDetails).text();
            }
          });

          if (ticker !== '' && industry !== '') {
            result.push({ ticker: ticker.replace(/\n/g, ''), industry: industry });
          }
        });
      });
    });

    return result;
  }
}
