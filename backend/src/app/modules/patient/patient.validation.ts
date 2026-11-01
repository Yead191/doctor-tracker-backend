import { z } from 'zod';

const createPatientZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Patient name is required' }).min(2, 'Name must be at least 2 characters'),
    age: z.coerce.number({ required_error: 'Age is required' }).min(0).max(150),
    gender: z.enum(['male', 'female', 'other'], {
      required_error: 'Gender must be male, female, or other',
    }),
    phone: z.string({ required_error: 'Phone number is required' }).min(5),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().optional(),
    condition: z.string({ required_error: 'Medical condition is required' }).min(2),
    doctor: z.string({ required_error: 'Assigned doctor ID is required' }),
    admissionDate: z.string().or(z.date()).optional(),
    status: z.enum(['active', 'under-treatment', 'recovered', 'critical']).optional(),
    notes: z.string().optional(),
    image: z.string().optional(),
  }),
});

const updatePatientZodSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    age: z.coerce.number().min(0).max(150).optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    phone: z.string().min(5).optional(),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().optional(),
    condition: z.string().min(2).optional(),
    doctor: z.string().optional(),
    admissionDate: z.string().or(z.date()).optional(),
    status: z.enum(['active', 'under-treatment', 'recovered', 'critical']).optional(),
    notes: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const PatientValidations = {
  createPatientZodSchema,
  updatePatientZodSchema,
};
