import { loginSchema } from "#shared/schemas/auth";

interface BackendAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    avatarUrl?: string;
    createdAt: string;
    role: string;
  };
}

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, loginSchema.parse);

  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl.replace(/\/$/, "");

  let response: BackendAuthResponse;
  try {
    response = await $fetch<BackendAuthResponse>(`${apiUrl}/auth/login`, {
      method: "POST",
      body,
    });
  } catch (err: unknown) {
    const status = (err as { statusCode?: number })?.statusCode ?? 401;
    throw createError({
      statusCode: status,
      message: "Invalid credentials",
    });
  }

  await setUserSession(event, {
    user: response.user,
    loggedInAt: new Date(),
    secure: {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    },
  });

  return { user: response.user };
});
