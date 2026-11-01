import { Schema, model } from 'mongoose';
import { IPatient, PatientModel } from './patient.interface';

const patientSchema = new Schema<IPatient, PatientModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      trim: true,
    },
    condition: {
      type: String,
      required: true,
      trim: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    admissionDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'under-treatment', 'recovered', 'critical'],
      default: 'active',
    },
    notes: {
      type: String,
      default: '',
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
patientSchema.index({ doctor: 1 });
patientSchema.index({ condition: 1 });
patientSchema.index({ status: 1 });
patientSchema.index({ admissionDate: -1 });
patientSchema.index({ createdAt: -1 });
patientSchema.index({ doctor: 1, createdAt: -1 });
patientSchema.index({ name: 'text', condition: 'text', phone: 'text' });

export const Patient = model<IPatient, PatientModel>('Patient', patientSchema);
