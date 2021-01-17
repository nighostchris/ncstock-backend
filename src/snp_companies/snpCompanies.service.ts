import axios from 'axios';
import * as cheerio from 'cheerio';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { SNPCompanies } from './snpCompanies.model';

class SNPCompany {
  ticker: String;
  industry: String;
}

@Injectable()
export class SNPCompaniesService {
  constructor(
    @InjectModel('snp_companies')
    private readonly companyModel: Model<SNPCompanies>
  ) {}

  async add(company: SNPCompany): Promise<SNPCompanies> {
    const newCompany = new this.companyModel(company);
    return newCompany.save();
  }

  async getAll(): Promise<SNPCompanies[]> {
    return await this.companyModel.find({}, { '_id': 0 });
  }

  async fetchAndUpdate(): Promise<String> {
    const wikiData = [];
    const databaseData = await this.companyModel.find({}, { '_id': 0 });
    const wikiPage = await axios.get('https://en.wikipedia.org/wiki/List_of_S%26P_500_companies');
    const $ = cheerio.load(wikiPage.data);

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
            wikiData.push({ ticker: ticker.replace(/\n/g, '').replace('.', '-'), industry: industry });
          }
        });
      });
    });

    const wikiDataTickers = wikiData.map((company) => company.ticker);
    const databaseDataTickers = databaseData.map((company) => company.ticker);

    // Find the new companies that database doesn't contain
    const newCompanies = wikiData.filter((company) => !databaseDataTickers.includes(company.ticker));

    // Find the old companies that wiki doesn't contain
    const oldCompanies = databaseDataTickers.filter((company) => !wikiDataTickers.includes(company));

    // Add all new companies
    newCompanies.forEach(async(targetCompany) => {
      const newCompany = new this.companyModel(targetCompany);
      await newCompany.save();
    });

    // Remove all old companines
    oldCompanies.forEach(async(targetCompany) => {
      await this.companyModel.deleteOne({ ticker: targetCompany });
    });

    return 'Successfully Updated.';
  }
}
