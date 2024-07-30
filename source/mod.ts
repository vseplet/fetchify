import { v, z } from "../deps.ts";
import { Fetchify } from "./Fetch.ts";
import { Limiter } from "./Limiter.ts";
import type {
  FetchInput,
  IFetchifyConfig,
  ILimiterRequestInit,
} from "./types.ts";

export const fetchify = (input: FetchInput, init?: ILimiterRequestInit) => {
  return Limiter.fetch(input, init);
};

fetchify.create = (options?: IFetchifyConfig) => {
  return new Fetchify(options);
};

export * from "./parsers.ts";
export { Limiter };
export { v, z };
export default fetchify;
