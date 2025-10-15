import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(2)
    .max(100)
    .trim(),
  email: z.string().max(255)
    .trim()
    .toLowerCase(),
  password: z.string().min(6),
  role: z.enum(['user', 'admin']).default('user'),
});

export const signInSchema = z.object({
  email: z.string({
    required_error: 'Email is required',
  }).max(255, 'Email must be at most 255 characters long')
    .email('Invalid email address')
    .trim()
    .toLowerCase(),
  password: z.string({
    required_error: 'Password is required',
  }).min(6, 'Password must be at least 6 characters long'),
});