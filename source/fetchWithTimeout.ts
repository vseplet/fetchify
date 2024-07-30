import type { FetchInput, ILimiterRequestInit } from "./types.ts";

export function fetchWithTimeout(
  input: FetchInput,
  timeout: number,
  init?: ILimiterRequestInit,
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  return fetch(input, {
    ...init,
    signal: controller.signal,
  }).finally(() => {
    clearTimeout(id);
  });
}
