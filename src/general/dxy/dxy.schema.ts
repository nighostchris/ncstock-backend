import * as mongoose from 'mongoose';

export const DXYSchema = new mongoose.Schema({
  date: String,
  price: Number,
}, {
  versionKey: false
});
