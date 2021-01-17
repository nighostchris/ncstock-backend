import * as mongoose from 'mongoose';

export const SNPBreadthSchema = new mongoose.Schema({
  date: String,
  communication: Number,
  consumer_discretionary: Number,
  consumer_staples: Number,
  energy: Number,
  financials: Number,
  health_care: Number,
  industrials: Number,
  materials: Number,
  real_estate: Number,
  technology: Number,  
  utilities: Number
}, {
  versionKey: false
});
