import { Document } from 'mongoose';

export interface Silver extends Document {
  readonly date: String;
  readonly price: Number;
}
