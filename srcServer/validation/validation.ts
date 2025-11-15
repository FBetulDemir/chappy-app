import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username can be min 3 characters")
    .max(10, "Username can be max 10 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and _"),
  password: z
    .string()
    .min(6, "Password can be min 6 characters")
    .max(15, "Password can be max 15 characters"),
  email: z.string().email("Invalid email").optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username required"),
  password: z.string().min(1, "Password required"),
});
