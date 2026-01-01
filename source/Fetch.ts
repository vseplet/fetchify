/**
 * @module
 *
 * Fetchify class providing HTTP methods with rate limiting and request configuration.
 * This module exports the main Fetchify class for creating configured HTTP clients.
 */

import { Limiter } from "./mod.ts";
import { combineURL, getUrlFromStringOrRequest } from "./helpers.ts";
import type {
  FetchInput,
  IFetchifyConfig,
  ILimiterRequestInit,
} from "./types.ts";

/**
 * Fetchify class for making HTTP requests with rate limiting and configuration.
 *
 * @example
 * ```ts
 * const api = new Fetchify({
 *   baseURL: "https://api.example.com",
 *   limiter: { rps: 5 }
 * });
 * await api.get("/users");
 * ```
 */
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

  /**
   * Performs a GET request.
   * @param input - The URL or Request object
   * @param init - Optional request configuration
   * @returns Promise resolving to Response
   */
  get(input: FetchInput, init?: ILimiterRequestInit): Promise<Response> {
    return this.#request("GET", input, init);
  }

  /**
   * Performs a POST request.
   * @param input - The URL or Request object
   * @param init - Optional request configuration
   * @returns Promise resolving to Response
   */
  post(input: FetchInput, init?: ILimiterRequestInit): Promise<Response> {
    return this.#request("POST", input, init);
  }

  /**
   * Performs a PUT request.
   * @param input - The URL or Request object
   * @param init - Optional request configuration
   * @returns Promise resolving to Response
   */
  put(input: FetchInput, init?: ILimiterRequestInit): Promise<Response> {
    return this.#request("PUT", input, init);
  }

  /**
   * Performs a DELETE request.
   * @param input - The URL or Request object
   * @param init - Optional request configuration
   * @returns Promise resolving to Response
   */
  delete(input: FetchInput, init?: ILimiterRequestInit): Promise<Response> {
    return this.#request("DELETE", input, init);
  }

  /**
   * Performs a HEAD request.
   * @param input - The URL or Request object
   * @param init - Optional request configuration
   * @returns Promise resolving to Response
   */
  head(input: FetchInput, init?: ILimiterRequestInit): Promise<Response> {
    return this.#request("HEAD", input, init);
  }

  /**
   * Performs a PATCH request.
   * @param input - The URL or Request object
   * @param init - Optional request configuration
   * @returns Promise resolving to Response
   */
  patch(input: FetchInput, init?: ILimiterRequestInit): Promise<Response> {
    return this.#request("PATCH", input, init);
  }
}
