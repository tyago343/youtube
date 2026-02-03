import type { Report } from "#shared/schemas/report";
import { reportsResponseSchema } from "#shared/schemas/report";

export default defineEventHandler(async (event): Promise<Report[]> => {
  const session = await requireUserSession(event);
  const secure = session.secure as { accessToken?: string } | undefined;
  const token = secure?.accessToken;
  if (!token) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl.replace(/\/$/, "");

  const raw = await $fetch<unknown>(`${apiUrl}/reports`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const parsed = reportsResponseSchema.safeParse(raw);
  if (!parsed.success) {
    throw createError({
      statusCode: 502,
      message: "Invalid reports response from API",
    });
  }

  return parsed.data;
});
