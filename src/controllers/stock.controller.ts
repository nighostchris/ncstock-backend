import axios from 'axios';
import * as cheerio from 'cheerio';
import * as yahooFinance from 'yahoo-finance';
import { Controller, Get, Param } from '@nestjs/common';

@Controller()
export class StockController {
  @Get('/stock/:id')
  async getDetails(@Param() params): Promise<string> {
    const stockDetails = await yahooFinance.historical({
      symbol: params.id,
      from: '2021-01-01',
      to: '2021-01-03',
    });

    return stockDetails;
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
