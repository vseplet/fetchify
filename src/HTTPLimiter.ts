import { delay } from "../deps.ts";
import { promiseWithTimeout } from "./timeout.ts";

type FetchInput = URL | Request | string;

interface ILimiterRequestInit extends RequestInit {
  attempts?: number;
  interval?: number;
  timeout?: number;
  unlimited?: boolean;
}

interface IRequestEntity {
  promise: Promise<Response>;
  init?: ILimiterRequestInit;
  input: FetchInput;
  resolve: (value: Response) => void;
  reject: (value: Error) => void;
  attempt: number;
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
      // Updated upstream

      //
      //Stashed changes
      if (entity) {
        this.#requestsPerIteration++;

        console.log("fetch!");

        const promise = fetch(entity.input, entity.init)
          .then((response) => {
            entity.resolve(response);
          })
          .catch((error) => {
            if (
              entity.init?.attempts !== undefined &&
              entity.attempt < entity.init.attempts
            ) {
              this.#pushRequest(entity.input, entity.attempt + 1, entity.init);
            }

            console.log("reject1");
            entity.reject(error);
          })
          .finally(() => {
            this.#requestsPerIteration--;
          });
        // Updated upstream
        //
        if (entity.init?.timeout && entity.init?.timeout > 0) {
          promiseWithTimeout(promise, entity.init.timeout, () => {
            if (
              entity.init?.attempts !== undefined &&
              entity.attempt < entity.init.attempts
            ) {
              this.#pushRequest(entity.input, entity.attempt + 1, entity.init);
            }

            this.#requestsPerIteration--;
            // entity.reject(new Error("timeout!"));
          });
        }
        //Stashed changes
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
      console.log("init timeout");
      promise = promiseWithTimeout<Response>(
        fetch(input, init),
        init.timeout,
        () => {
          console.log("timeout!");
        },
      );
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

    // Updated upstream
    //
    return promise;
  }

  #limitedFetch(
    input: FetchInput,
    init?: ILimiterRequestInit,
  ): Promise<Response> {
    const promise = this.#pushRequest(input, 1, init);

    //Stashed changes
    if (!this.#loopIsWorking) {
      this.#loopIsWorking = !this.#loopIsWorking;
      this.#loop();
    }

    return promise;
  }
  // Updated upstream
  //
  fetch(input: FetchInput, init?: ILimiterRequestInit): Promise<Response> {
    return init && init.unlimited === true
      ? this.#unlimitedFetch(input, init)
      : this.#limitedFetch(input, init);
  }
  //Stashed changes
}
