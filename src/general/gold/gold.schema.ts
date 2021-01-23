import * as mongoose from 'mongoose';

export const GoldSchema = new mongoose.Schema({
  date: String,
  price: Number,
}, {
  versionKey: false
});
