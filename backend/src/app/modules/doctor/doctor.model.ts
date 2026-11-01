import { Schema, model } from 'mongoose';
import { IDoctor, DoctorModel } from './doctor.interface';

const doctorSchema = new Schema<IDoctor, DoctorModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    hospital: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    experience: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for query optimization
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ hospital: 1 });
doctorSchema.index({ status: 1 });
doctorSchema.index({ createdAt: -1 });
doctorSchema.index({ name: 'text', specialization: 'text', hospital: 'text' });

export const Doctor = model<IDoctor, DoctorModel>('Doctor', doctorSchema);
