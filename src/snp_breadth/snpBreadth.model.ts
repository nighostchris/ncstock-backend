import { Document } from 'mongoose';

export interface SNPBreadth extends Document {
  readonly date: String;
  readonly communication: Number;
  readonly consumer_discretionary: Number;
  readonly consumer_staples: Number;
  readonly energy: Number;
  readonly financials: Number;
  readonly health_care: Number;
  readonly industrials: Number;
  readonly materials: Number;
  readonly real_estate: Number;
  readonly technology: Number;  
  readonly utilities: Number;
}
