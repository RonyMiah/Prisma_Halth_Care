import { Doctor, Gender } from '@prisma/client';
import { z } from 'zod';

const createAdmin = z.object({
  password: z.string({
    required_error: 'Password is Required !',
  }),
  admin: z.object({
    name: z.string({
      required_error: 'Name is Required !',
    }),
    email: z.string({
      required_error: 'Email is Required !',
    }),
    contactNumber: z.string({
      required_error: 'Contact Number is Required !',
    }),
  }),
});

const createDoctor = z.object({
  password: z.string({
    required_error: 'Password is Required !',
  }),
  doctor: z.object({
    name: z.string({
      required_error: 'Name is Required !',
    }),
    email: z.string({
      required_error: 'Email is Required !',
    }),
    contactNumber: z.string({
      required_error: 'Contact Number is Required !',
    }),
    address: z.string().optional(),
    registrationNumber: z.string({
      required_error: 'Registration Number is required !',
    }),
    exprence: z.number().optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE]),
    appointmentFee: z.number({
      required_error: 'appoinmentFee is required !',
    }),
    qualification: z.string({
      required_error: 'Qualification is required !',
    }),
    currentWorkingPlace: z.string({
      required_error: 'currentWorkingPlace is required !',
    }),
    designation: z.string({
      required_error: 'Designation is required !',
    }),
  }),
});

export const userValidation = {
  createAdmin,
  createDoctor,
};
