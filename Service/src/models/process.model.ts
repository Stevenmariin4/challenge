import mongoose, { Schema } from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    site: { type: String },
    id: { type: String },
    price: { type: String },
    start_time: { type: Date },
    name: { type: String },
    description: { type: String },
    nickName: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default itemSchema;
