import { envSchema, type Env } from "./env.schema";

function validateEnv(): Env {
  const rawEnv = {
    VITE_API_URL: import.meta.env.VITE_API_URL,
  };

  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    const errorMessages = result.error.issues.map((issue) => {
      const path = issue.path.join(".");
      return `  - ${path}: ${issue.message}`;
    });

    throw new Error(
      `❌ Invalid environment variables:\n\n${errorMessages.join("\n")}\n\n` +
        `Please check your .env file or environment configuration.\n` +
        `Required variables:\n` +
        `  - VITE_API_URL: URL base of the API (must end with /)`
    );
  }

  return result.data;
}

export const env = validateEnv();
