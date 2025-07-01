import mongoose, { Document, Schema } from 'mongoose';

export interface IFrequentFlyerProgram extends Document {
  name: string;
  assetName: string;
  enabled: boolean;
  archived: boolean;
  createdAt: Date;
  modifiedAt: Date;
}

const FrequentFlyerProgramSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  assetName: {
    type: String,
    default: '',
  },
  enabled: {
    type: Boolean,
    default: true,
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

FrequentFlyerProgramSchema.pre('save', function(next) {
  this.modifiedAt = new Date();
  next();
});

export default mongoose.model<IFrequentFlyerProgram>('FrequentFlyerProgram', FrequentFlyerProgramSchema);