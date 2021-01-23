import * as mongoose from 'mongoose';

export const CopperSchema = new mongoose.Schema({
  date: String,
  price: Number,
}, {
  versionKey: false
});
