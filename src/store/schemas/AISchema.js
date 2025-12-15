import {z} from 'zod';

export const loginSchema = z.object({
  email: z.string().min(5, "Put an email in here").email("Invalid email address!"),
  password: z.string().min(4, "Password must be at least 4 characters long").max(100, "Whoa... that's a long password!"),
});

export const registerSchema = z.object({
  username: z.string().min(2, "Name must be at least 2 characters long").max(50, "Name is too long (max 50 characters)"),
  email: z.string().min(5, "Put an email in here").email("Invalid email address!"),
  password: z.string().min(4, "Password must be at least 4 characters long").max(100, "Whoa... that's a long password!"),
});

export const AISchema = z.object({
  text: z.string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message is too long (max 1000 characters)"),
});