import type { H3Event } from "h3";

export function getApiBase(event?: H3Event): string {
  const config = useRuntimeConfig(event);
  return (config.public.apiUrl as string).replace(/\/$/, "");
}
