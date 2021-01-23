import { Document } from 'mongoose';

export interface Gold extends Document {
  readonly date: String;
  readonly price: Number;
}
