import { z } from 'zod';

export const updateUserSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  emailAddress: z.string().email().optional(),
  username: z.string().min(3).max(30).optional(),
  password: z.string().min(8).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
