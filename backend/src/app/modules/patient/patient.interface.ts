import { Model, Types } from 'mongoose';

export type IPatient = {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address?: string;
  condition: string;
  doctor: Types.ObjectId;
  admissionDate: Date;
  status: 'active' | 'under-treatment' | 'recovered' | 'critical';
  notes?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PatientModel = Model<IPatient>;
