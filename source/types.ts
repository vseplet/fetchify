export type FetchInput = URL | Request | string;

export interface IQueryParams {
  [name: string]: string | number | boolean;
}

export interface ILimiterRequestInit extends RequestInit {
  attempts?: number;
  interval?: number;
  timeout?: number;
  unlimited?: boolean;
  params?: IQueryParams;
}

export type ResolveCallback = (value: Response) => void;
export type RejectCallback = (value: Error) => void;

export interface IRequestEntity {
  init?: ILimiterRequestInit;
  input: FetchInput;
  resolve: ResolveCallback;
  reject: RejectCallback;
  attempt: number;
}

export type RateLimitExceededHandler = (response: Response) => number;

export type StatusHandler = (
  response: Response,
  resolve: ResolveCallback,
  reject: RejectCallback,
  retry: () => void,
) => void;

export interface ILimiterOptions {
  unlimited?: boolean;
  rps: number; // requests per second
  rt?: RateLimitExceededHandler;
  status?: {
    [code: number]: StatusHandler;
  };
}

export interface IFetchifyConfig {
  limiter?: ILimiterOptions;
  baseURL?: FetchInput;
  headers?: HeadersInit;
}
