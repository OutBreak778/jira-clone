import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(3, "Minimum 3 characters required")
  });

export const registerSchema = z.object({
  name: z.string().trim().min(4, "Minimum 4 character of username required"),
  email: z.string().email(),
  password: z.string().min(3, "Minimum 3 characters required"),
});