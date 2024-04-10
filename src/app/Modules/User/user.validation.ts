import { Doctor, Gender, userRole, userStatus } from '@prisma/client';
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

const createPatient = z.object({
  password: z.string(),
  patient: z.object({
    email: z
      .string({
        required_error: 'Email is required!',
      })
      .email(),
    name: z.string({
      required_error: 'Name is required!',
    }),
    contactNumber: z.string({
      required_error: 'Contact number is required!',
    }),
    address: z.string({
      required_error: 'Address is required',
    }),
  }),
});

const updateProfileValidation = z.object({
  status: z.enum([userStatus.ACTIVE, userStatus.BLOCKED, userStatus.DELETED]),
});

export const userValidation = {
  createAdmin,
  createDoctor,
  createPatient,
  updateProfileValidation,
};
