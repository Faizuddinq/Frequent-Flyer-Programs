import mongoose, { Document, Schema } from 'mongoose';

export interface ICreditCard extends Document {
  name: string;
  bankName: string;
  archived: boolean;
  createdAt: Date;
  modifiedAt: Date;
}

const CreditCardSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  bankName: {
    type: String,
    required: true,
    trim: true,
  },
  archived: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  modifiedAt: {
    type: Date,
    default: Date.now,
  },
});

CreditCardSchema.pre('save', function(next) {
  this.modifiedAt = new Date();
  next();
});

export default mongoose.model<ICreditCard>('CreditCard', CreditCardSchema);