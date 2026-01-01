/**
 * @module
 *
 * Main entrypoint for fetchify - a fetch wrapper with rate limiting and validation.
 * Provides enhanced HTTP client with timeout, retries, rate limiting, and response parsing.
 *
 * @example
 * ```ts
 * import fetchify from "@vseplet/fetchify";
 *
 * // Simple request
 * const response = await fetchify("https://api.example.com/data");
 *
 * // Create configured instance
 * const api = fetchify.create({
 *   baseURL: "https://api.example.com",
 *   limiter: { rps: 5 }
 * });
 * ```
 */

import { v, z } from "../deps.ts";
import { Fetchify } from "./Fetch.ts";
import { Limiter } from "./Limiter.ts";
import type {
  FetchInput,
  IFetchifyConfig,
  ILimiterRequestInit,
} from "./types.ts";

/**
 * Main fetchify function for making HTTP requests.
 *
 * @param input - The URL or Request object
 * @param init - Optional request configuration with timeout, attempts, etc.
 * @returns Promise resolving to Response
 *
 * @example
 * ```ts
 * const response = await fetchify("https://api.example.com", {
 *   timeout: 5000,
 *   attempts: 3
 * });
 * ```
 */
export const fetchify = (
  input: FetchInput,
  init?: ILimiterRequestInit,
): Promise<Response> => {
  return Limiter.fetch(input, init);
};

/**
 * Creates a configured Fetchify instance with base URL and rate limiting.
 *
 * @param options - Configuration options for the instance
 * @returns Configured Fetchify instance
 *
 * @example
 * ```ts
 * const api = fetchify.create({
 *   baseURL: "https://api.example.com",
 *   limiter: { rps: 5 }
 * });
 * await api.get("/users");
 * ```
 */
fetchify.create = (options?: IFetchifyConfig): Fetchify => {
  return new Fetchify(options);
};

export * from "./parsers.ts";
export { Limiter };
export { v, z };
export default fetchify;
