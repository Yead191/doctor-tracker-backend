import { z } from 'zod';

const createDoctorZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Doctor name is required' }).min(2, 'Name must be at least 2 characters'),
    specialization: z.string({ required_error: 'Specialization is required' }).min(2, 'Specialization is required'),
    hospital: z.string({ required_error: 'Hospital is required' }).min(2, 'Hospital is required'),
    phone: z.string({ required_error: 'Phone number is required' }).min(5, 'Phone number must be valid'),
    email: z.string({ required_error: 'Email is required' }).email('Valid email is required'),
    status: z.enum(['active', 'inactive']).optional(),
    experience: z.coerce.number().min(0).optional(),
    image: z.string().optional(),
  }),
});

const updateDoctorZodSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    specialization: z.string().min(2).optional(),
    hospital: z.string().min(2).optional(),
    phone: z.string().min(5).optional(),
    email: z.string().email().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    experience: z.coerce.number().min(0).optional(),
    image: z.string().optional(),
  }),
});

export const DoctorValidations = {
  createDoctorZodSchema,
  updateDoctorZodSchema,
};
