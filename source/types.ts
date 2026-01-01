/**
 * @module
 *
 * TypeScript type definitions for fetchify.
 * Exports all interfaces and types used in the public API.
 */

/**
 * Valid input types for fetch operations.
 */
export type FetchInput = URL | Request | string;

/**
 * Query parameters object for URL construction.
 */
export interface IQueryParams {
  [name: string]: string | number | boolean;
}

/**
 * Extended RequestInit with additional options for rate limiting and retries.
 */
export interface ILimiterRequestInit extends RequestInit {
  /** Number of retry attempts on failure */
  attempts?: number;
  /** Interval between retry attempts in milliseconds */
  interval?: number;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Bypass rate limiting for this request */
  unlimited?: boolean;
  /** Query parameters to append to URL */
  params?: IQueryParams;
}

/**
 * Callback type for resolving requests.
 */
export type ResolveCallback = (value: Response) => void;

/**
 * Callback type for rejecting requests.
 */
export type RejectCallback = (value: Error) => void;

/**
 * Internal request entity in the rate limiter queue.
 */
export interface IRequestEntity {
  init?: ILimiterRequestInit;
  input: FetchInput;
  resolve: ResolveCallback;
  reject: RejectCallback;
  attempt: number;
}

/**
 * Handler function for rate limit exceeded (429) responses.
 * @returns Delay in milliseconds before retrying
 */
export type RateLimitExceededHandler = (response: Response) => number;

/**
 * Custom handler for specific HTTP status codes.
 */
export type StatusHandler = (
  response: Response,
  resolve: ResolveCallback,
  reject: RejectCallback,
  retry: () => void,
) => void;

/**
 * Configuration options for rate limiting.
 */
export interface ILimiterOptions {
  /** Disable rate limiting globally */
  unlimited?: boolean;
  /** Requests per second */
  rps?: number;
  /** Handler for rate limit exceeded (429) responses */
  rt?: RateLimitExceededHandler;
  /** Custom handlers for specific status codes */
  status?: {
    [code: number]: StatusHandler;
  };
}

/**
 * Configuration options for Fetchify instance.
 */
export interface IFetchifyConfig {
  /** Rate limiting configuration */
  limiter?: ILimiterOptions;
  /** Base URL for all requests */
  baseURL?: FetchInput;
  /** Default headers for all requests */
  headers?: HeadersInit;
}
