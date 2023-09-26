import { delay } from "../deps.ts";

type FetchInput = URL | Request | string;

interface IRequestEntity {
  promise: Promise<Response>;
  init?: RequestInit;
  input: FetchInput;
  resolve: (value: Response) => void;
  reject: (value: Error) => void;
}

interface IHTTPLimiterOptions {
  rps: number; // requests per second
  interval: number;
}

export class HTTPLimiter {
  #options: IHTTPLimiterOptions = {
    rps: 1,
    interval: 0,
  };

  #queue: IRequestEntity[] = [];
  #iterationStartTime = 0;
  #requestsPerIteration = 0;

  constructor(options?: Partial<IHTTPLimiterOptions>) {
    if (options)
    {
      this.#options = { ...this.#options, ...options };
    }
  }

  async #loop() {
    this.#iterationStartTime = new Date().getTime();

    while (true)
    {
      const entity = this.#queue.shift();
      if (!entity) break;
      if (this.#requestsPerIteration >= this.#options.rps)
      {
        await delay(this.#options.interval);
        continue;
      }

      this.#requestsPerIteration ++;
      fetch(entity.input, entity.init)
        .then(resp => {
          entity.resolve(response);
        })
        .catch(err => {
          entity.reject(error);
        })
        .finally(() => {
          this.#requestsPerIteration --;
        });

      if (this.#requestsPerIteration == this.#options.rps)
      {
        const timeOffset = this.#iterationStartTime + 1000 - new Date().getTime();
        await delay(timeOffset);
        this.#iterationStartTime = new Date().getTime();
      }
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
