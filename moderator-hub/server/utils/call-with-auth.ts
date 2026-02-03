import type { H3Event } from "h3";

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

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
    const status = (err as { statusCode?: number })?.statusCode;
    if (status !== 401 || !refreshToken) {
      throw err;
    }
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiUrl.replace(/\/$/, "");
    const baseUrl = `${apiUrl}`;

    let newTokens: RefreshResponse;
    try {
      newTokens = await $fetch<RefreshResponse>(`${baseUrl}/auth/refresh`, {
        method: "POST",
        body: { refreshToken },
      });
    } catch (err: unknown) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

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
