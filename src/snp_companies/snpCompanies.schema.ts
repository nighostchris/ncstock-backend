import * as mongoose from 'mongoose';

export const SNPCompaniesSchema = new mongoose.Schema({
  ticker: String,
  industry: String,
}, {
  versionKey: false
});
