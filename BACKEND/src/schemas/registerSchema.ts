import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string({
      required_error: "First name is required",
    })
    .min(1, "First name cannot be empty"),

  lastName: z
    .string({
      required_error: "Last name is required",
    })
    .min(1, "Last name cannot be empty"),

  username: z
    .string({
      required_error: "Username is required",
    })
    .min(3, "Username must be at least 3 characters"),

  emailAddress: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email address"),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
