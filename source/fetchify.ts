import { Limiter } from "../mod.ts";
import { combineURL, getUrlFromStringOrRequest } from "./helpers.ts";
import { FetchInput, IFetchifyConfig, ILimiterRequestInit } from "./types.ts";

export const fetchify = (input: FetchInput, init?: ILimiterRequestInit) => {
  return Limiter.fetch(input, init);
};

fetchify.create = (options?: IFetchifyConfig) => {
  return new Fetchify(options);
};

export class Fetchify {
  #config: IFetchifyConfig = {};
  #limiter: Limiter;

  constructor(config?: IFetchifyConfig) {
    this.#limiter = new Limiter(config?.limiter);
    this.#config = { ...this.#config, ...config };
  }

  #request(method: string, input: FetchInput, init?: ILimiterRequestInit) {
    return this.#limiter.fetch(
      this.#config.baseURL
        ? combineURL(this.#config.baseURL, input)
        : getUrlFromStringOrRequest(input),
      {
        method,
        ...init,
        headers: this.#config.headers,
      },
    );
  }

  get(input: FetchInput, init?: ILimiterRequestInit) {
    return this.#request("GET", input, init);
  }

  post(input: FetchInput, init?: ILimiterRequestInit) {
    return this.#request("POST", input, init);
  }

  put(input: FetchInput, init?: ILimiterRequestInit) {
    return this.#request("PUT", input, init);
  }

  delete(input: FetchInput, init?: ILimiterRequestInit) {
    return this.#request("DELETE", input, init);
  }

  head(input: FetchInput, init?: ILimiterRequestInit) {
    return this.#request("HEAD", input, init);
  }

  patch(input: FetchInput, init?: ILimiterRequestInit) {
    return this.#request("PATCH", input, init);
  }
}
