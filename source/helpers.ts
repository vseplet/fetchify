import type { FetchInput, IQueryParams } from "./types.ts";

export const objectToQueryParams = (params: IQueryParams): string => {
  return Object.entries(params)
    .map(([key, value]) =>
      `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
};

export const getUrlFromStringOrRequest = (input: FetchInput): string => {
  let url = "";
  if (input instanceof URL) {
    return input.toString();
  } else if (input instanceof Request) {
    return input.url;
  } else {
    return input;
  }
};

export const combineURL = (
  baseURL: FetchInput,
  path: FetchInput,
  params?: IQueryParams,
): URL => {
  let part1 = getUrlFromStringOrRequest(baseURL);
  let part2 = getUrlFromStringOrRequest(path);
  if (!part1.endsWith("/")) part1 += "/";
  if (part2.startsWith("/")) part2 = part2.slice(1);
  let newBareURL = part1 + part2;
  if (newBareURL.endsWith("/")) newBareURL = newBareURL.slice(0, -1); // Удаление завершающего "/"
  const url = new URL(newBareURL);
  if (params) url.search = objectToQueryParams(params);
  return url;
};
