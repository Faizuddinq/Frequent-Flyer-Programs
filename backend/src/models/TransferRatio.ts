import mongoose, { Document, Schema } from 'mongoose';

export interface ITransferRatio extends Document {
  programId: mongoose.Types.ObjectId;
  creditCardId: mongoose.Types.ObjectId;
  ratio: number;
  archived: boolean;
  createdAt: Date;
  modifiedAt: Date;
}

const TransferRatioSchema = new Schema({
  programId: {
    type: Schema.Types.ObjectId,
    ref: 'FrequentFlyerProgram',
    required: true,
  },
  creditCardId: {
    type: Schema.Types.ObjectId,
    ref: 'CreditCard',
    required: true,
  },
  ratio: {
    type: Number,
    required: true,
    min: 0,
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

TransferRatioSchema.pre('save', function(next) {
  this.modifiedAt = new Date();
  next();
});

// Ensure unique ratio per program-card combination
TransferRatioSchema.index({ programId: 1, creditCardId: 1 }, { unique: true });

export default mongoose.model<ITransferRatio>('TransferRatio', TransferRatioSchema);