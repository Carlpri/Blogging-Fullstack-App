import { z } from 'zod';

export const updateUserSchema = z.object({
  userId: z.string(), // UUID
  username: z.string().min(3).optional(),
  password: z.string().min(8).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
