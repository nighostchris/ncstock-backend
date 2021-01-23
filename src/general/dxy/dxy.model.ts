import { Document } from 'mongoose';

export interface DXY extends Document {
  readonly date: String;
  readonly price: Number;
}
