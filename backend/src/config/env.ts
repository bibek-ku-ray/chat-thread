import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.string().default("8000"),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.string().default("5432"),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string().default("postgres"),
  DB_NAME: z.string().default("chat_thread_db"),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  process.exit(1);
}

export const env = parsed.data;
