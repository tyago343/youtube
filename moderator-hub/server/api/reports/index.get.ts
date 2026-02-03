import type { Report } from "#shared/schemas/report";
import { reportsResponseSchema } from "#shared/schemas/report";
import { callWithAuth } from "../../utils/call-with-auth";

export default defineEventHandler(async (event): Promise<Report[]> => {
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl.replace(/\/$/, "");

  const raw = await callWithAuth(event, (accessToken) =>
    $fetch<unknown>(`${apiUrl}/reports`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  );
  const parsed = reportsResponseSchema.safeParse(raw);
  if (!parsed.success) {
    throw createError({
      statusCode: 502,
      message: "Invalid reports response from API",
    });
  }

  return parsed.data;
});
