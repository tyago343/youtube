import type { User } from "#auth-utils";
import { userSchema } from "#shared/schemas/auth";
import { callWithAuth } from "../../utils/call-with-auth";
import { getApiBase } from "../../utils/api-base";

export default defineEventHandler(async (event): Promise<User> => {
  const raw = await callWithAuth(event, (accessToken) =>
    $fetch<unknown>(`${getApiBase(event)}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  );

  const parsed = userSchema.safeParse(raw);
  if (!parsed.success) {
    throw createError({
      statusCode: 502,
      message: "Invalid user response from API",
    });
  }

  return parsed.data;
});
