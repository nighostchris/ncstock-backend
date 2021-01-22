import axios from 'axios';
import * as cheerio from 'cheerio';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeneralService {
  constructor() {}

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
}
