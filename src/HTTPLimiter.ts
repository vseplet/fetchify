import { delay } from "../deps.ts";
import { fetchWithTimeout } from "./fetchWithTimeout.ts";
import {
  FetchInput,
  IHTTPLimiterOptions,
  ILimiterRequestInit,
  IRequestEntity,
} from "./types.ts";

export class HTTPLimiter {
  #options: IHTTPLimiterOptions = {
    rps: 1,
    interval: 0,
  };

  #queue: IRequestEntity[] = [];
  #iterationStartTime = 0;
  #requestsPerIteration = 0;
  #loopIsWorking = false;

  constructor(options?: Partial<IHTTPLimiterOptions>) {
    if (options) {
      this.#options = { ...this.#options, ...options };
    }
  }

  async #loop() {
    this.#iterationStartTime = new Date().getTime();

    while (true) {
      if (this.#requestsPerIteration >= this.#options.rps) {
        await delay(this.#options.interval);
        continue;
      }

      const entity = this.#queue.shift();

      if (entity) {
        this.#requestsPerIteration++;

        if (entity.init?.timeout && entity.init?.timeout > 0) {
          fetchWithTimeout(entity.input, entity.init.timeout, entity.init)
            .catch((error) => {
              this.#requestsPerIteration--;
              if (
                entity.init?.attempts != undefined &&
                entity.attempt < entity.init?.attempts
              ) {
                // this.#pushRequest(
                //   entity.input,
                //   entity.attempt + 1,
                //   Object.assign({}, entity.init),
                // );
              }

              entity.reject(error);
            });
        } else {
          fetch(entity.input, entity.init)
            .then((response) => {
              entity.resolve(response);
            })
            .catch((error) => {
              entity.reject(error);
            })
            .finally(() => {
              this.#requestsPerIteration--;
            });
        }
      }

      if (!entity && this.#requestsPerIteration == 0) {
        this.#loopIsWorking = !this.#loopIsWorking;
        return;
      }

      if (!entity && this.#iterationStartTime > 0) {
        await delay(0);
      }

      if (this.#requestsPerIteration == this.#options.rps) {
        const timeOffset = this.#iterationStartTime + 1000 -
          new Date().getTime();
        await delay(timeOffset);
        this.#iterationStartTime = new Date().getTime();
      }
    }
  }

  #unlimitedFetch(
    input: FetchInput,
    init: ILimiterRequestInit,
  ): Promise<Response> {
    let promise = undefined as unknown as Promise<Response>;

    if (init.timeout) {
      promise = fetchWithTimeout(input, init.timeout, init);
    } else {
      promise = fetch(input, init);
    }

    return promise;
  }

  #pushRequest(
    input: FetchInput,
    attempt: number,
    init?: ILimiterRequestInit,
  ): Promise<Response> {
    let promise = undefined as unknown as Promise<Response>;

    promise = new Promise((resolve, reject) => {
      this.#queue.push({
        promise,
        input,
        init,
        resolve,
        reject,
        attempt,
      });
    });

    return promise;
  }

  #limitedFetch(
    input: FetchInput,
    init?: ILimiterRequestInit,
  ): Promise<Response> {
    const promise = this.#pushRequest(input, 0, init);

    if (!this.#loopIsWorking) {
      this.#loopIsWorking = !this.#loopIsWorking;
      this.#loop();
    }

    return promise;
  }

  fetch(input: FetchInput, init?: ILimiterRequestInit): Promise<Response> {
    return init && init.unlimited === true
      ? this.#unlimitedFetch(input, init)
      : this.#limitedFetch(input, init);
  }
}
