import * as mongoose from 'mongoose';

export const OilSchema = new mongoose.Schema({
  date: String,
  price: Number,
}, {
  versionKey: false
});
