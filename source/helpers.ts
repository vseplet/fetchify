import { FetchInput, IQueryParams } from "./types.ts";

export const objectToQueryParams = (params: IQueryParams): string => {
  return Object.entries(params)
    .map(([key, value]) =>
      `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
};

export const getUrlFromStringOrRequest = (input: FetchInput): string => {
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
  const url = new URL(
    getUrlFromStringOrRequest(baseURL),
    getUrlFromStringOrRequest(path),
  );

  if (params) url.search = objectToQueryParams(params);

  return url;
};
