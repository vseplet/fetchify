import { delay } from "../deps.ts";

interface IRequestEntity {
  promise: Promise<Response>;
  init?: RequestInit;
  input: FetchInput;
  resolve: (value: Response) => void;
  reject: (value: Error) => void;
}

interface IHTTPLimiterOptions {
  interval: number;
}

type FetchInput = URL | Request | string;

export class HTTPLimiter {
  #options: IHTTPLimiterOptions = {
    interval: 0,
  };

  #queue: IRequestEntity[] = [];

  constructor(options?: Partial<IHTTPLimiterOptions>) {
    if (options) {
      for (const [key, value] of Object.entries(options)) {
        // @ts-ignore
        if (key in this.#options) this.#options[key] = value;
      }
    }
  }

  async #loop() {
    while (true) {
      const entity = this.#queue.shift();
      if (!entity) break;

      try {
        const response = await fetch(entity.input, entity.init);
        entity.resolve(response);
      } catch (error) {
        entity.reject(error);
      }

      await delay(this.#options.interval);
    }
  }

  fetch(input: FetchInput, init?: RequestInit): Promise<Response> {
    let promise = undefined as unknown as Promise<Response>;

    promise = new Promise((resolve, reject) => {
      this.#queue.push({
        promise,
        input,
        init,
        resolve,
        reject,
      });
    });

    if (this.#queue.length === 1) this.#loop();

    return promise;
  }
}
