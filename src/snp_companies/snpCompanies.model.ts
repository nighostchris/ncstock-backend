import { Document } from 'mongoose';

export interface SNPCompanies extends Document {
  readonly ticker: String;
  readonly industry: String;
}
