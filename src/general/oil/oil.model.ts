import { Document } from 'mongoose';

export interface Oil extends Document {
  readonly date: String;
  readonly price: Number;
}
