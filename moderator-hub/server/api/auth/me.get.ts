import type { User } from "#auth-utils";
import { callWithAuth } from "../../utils/call-with-auth";

export default defineEventHandler(async (event): Promise<User> => {
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl.replace(/\/$/, "");

  return callWithAuth(event, (accessToken) =>
    $fetch<User>(`${apiUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  );
});
