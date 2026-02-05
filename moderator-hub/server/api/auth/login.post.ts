import {
  loginSchema,
  refreshTokenResponseSchema,
} from "#shared/schemas/auth";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, loginSchema.parse);

  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl.replace(/\/$/, "");

  let raw: unknown;
  try {
    raw = await $fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      body,
    });
  } catch (err: unknown) {
    const status =
      err && typeof err === "object" && "statusCode" in err
        ? (err as { statusCode: number }).statusCode
        : 401;
    throw createError({
      statusCode: status,
      message: "Invalid credentials",
    });
  }

  const parsed = refreshTokenResponseSchema.safeParse(raw);
  if (!parsed.success) {
    throw createError({
      statusCode: 502,
      message: "Invalid auth response from API",
    });
  }
  const response = parsed.data;
  if (!response.user) {
    throw createError({
      statusCode: 502,
      message: "Invalid auth response from API",
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
