export type FetchInput = URL | Request | string;

export interface ILimiterRequestInit extends RequestInit {
  attempts?: number;
  interval?: number;
  timeout?: number;
  unlimited?: boolean;
}

export interface IRequestEntity {
  promise: Promise<Response>;
  init?: ILimiterRequestInit;
  input: FetchInput;
  resolve: (value: Response) => void;
  reject: (value: Error) => void;
  attempt: number;
}

export interface IHTTPLimiterOptions {
  rps: number; // requests per second
  interval: number;
}
