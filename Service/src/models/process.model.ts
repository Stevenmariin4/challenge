import mongoose from 'mongoose';

const processSchema = new mongoose.Schema(
  {
    status: { type: String },
    totalItems: { type: String },
    itemsAnalyzed: { type: Number },
    itemsSuccessfull: { type: Array },
    itemsError: { type: Array },
    startTime: { type: String },
    endTime: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default processSchema;
