import { FetchInput } from "./types.ts";

export const combineURL = (baseURL: FetchInput, path: FetchInput): URL => {
  const getUrlFromStringOrRequest = (input: FetchInput): string => {
    if (input instanceof URL) {
      return input.toString();
    } else if (input instanceof Request) {
      return input.url;
    } else {
      return input;
    }
  };

  return new URL(
    getUrlFromStringOrRequest(baseURL),
    getUrlFromStringOrRequest(path),
  );
};
