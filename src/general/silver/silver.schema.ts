import * as mongoose from 'mongoose';

export const SilverSchema = new mongoose.Schema({
  date: String,
  price: Number,
}, {
  versionKey: false
});
