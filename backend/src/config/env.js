import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters"),
  FRONTEND_ORIGIN: z.string().default("http://localhost:8080"),
  AVIATIONSTACK_API_KEY: z.string().optional(),
  ADMIN_SIGNUP_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
