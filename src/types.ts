export type FetchInput = URL | Request | string;

export interface ILimiterRequestInit extends RequestInit {
  attempts?: number;
  interval?: number;
  timeout?: number;
  unlimited?: boolean;
}

export interface IRequestEntity {
  init?: ILimiterRequestInit;
  input: FetchInput;
  resolve: (value: Response) => void;
  reject: (value: Error) => void;
  attempt: number;
}

export interface ILimiterOptions {
  rps: number; // requests per second
  interval: number;
}
