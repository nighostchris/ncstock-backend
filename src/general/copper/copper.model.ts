import { Document } from 'mongoose';

export interface Copper extends Document {
  readonly date: String;
  readonly price: Number;
}
