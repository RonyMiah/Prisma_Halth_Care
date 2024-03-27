import { z } from 'zod';

const updateValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
});

export const AdminValidationSchemas = {
  updateValidation,
};
