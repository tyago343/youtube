import type { H3Event } from "h3";
import { refreshTokenResponseSchema } from "#shared/schemas/auth";
import { getApiBase } from "./api-base";

export async function callWithAuth<T>(
  event: H3Event,
  fn: (accessToken: string) => Promise<T>
): Promise<T> {
  const session = await requireUserSession(event);
  const secure = session.secure as
    | { accessToken?: string; refreshToken?: string }
    | undefined;
  let accessToken = secure?.accessToken;
  const refreshToken = secure?.refreshToken;

  if (!accessToken) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  try {
    return await fn(accessToken);
  } catch (err: unknown) {
    const status =
      err && typeof err === "object" && "statusCode" in err
        ? (err as { statusCode: number }).statusCode
        : undefined;
    if (status !== 401 || !refreshToken) {
      throw err;
    }

    let raw: unknown;
    try {
      raw = await $fetch(`${getApiBase(event)}/auth/refresh`, {
        method: "POST",
        body: { refreshToken },
      });
    } catch {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    const parsed = refreshTokenResponseSchema.safeParse(raw);
    if (!parsed.success) {
      throw createError({
        statusCode: 502,
        message: "Invalid refresh response from API",
      });
    }
    const newTokens = parsed.data;

    await setUserSession(event, {
      user: session.user,
      loggedInAt: session.loggedInAt,
      secure: {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      },
    });

    return await fn(newTokens.accessToken);
  }
}
