import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string({
      required_error: "Email or username is required",
    })
    .min(1, "Email or username cannot be empty"),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(1, "Password cannot be empty"),
});

export type LoginInput = z.infer<typeof loginSchema>; 