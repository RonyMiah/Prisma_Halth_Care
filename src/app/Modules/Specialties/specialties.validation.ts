import { z } from 'zod';

const createSpecialties = z.object({
  title: z.string({ required_error: 'Title is Required !' }),
});

export const SpecialTiesValidation = {
  createSpecialties,
};
