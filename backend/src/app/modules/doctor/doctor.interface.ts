import { Model } from 'mongoose';

export type IDoctor = {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  experience?: number;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type DoctorModel = Model<IDoctor>;

