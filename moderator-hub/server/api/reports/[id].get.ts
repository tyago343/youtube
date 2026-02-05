import type { FullReportResponse } from "#shared/schemas/report";
import { fullReportResponseSchema } from "#shared/schemas/report";
import { callWithAuth } from "../../utils/call-with-auth";
import { getApiBase } from "../../utils/api-base";

export default defineEventHandler(async (event): Promise<FullReportResponse> => {
  const id = getRouterParam(event, "id");
  const raw = await callWithAuth(event, (accessToken) =>
    $fetch<unknown>(`${getApiBase(event)}/reports/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  );
  const parsed = fullReportResponseSchema.safeParse(raw);
  if (!parsed.success) {
    throw createError({
      statusCode: 502,
      message: "Invalid reports response from API",
    });
  }

  return parsed.data;
});
