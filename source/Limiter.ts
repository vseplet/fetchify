import { delay } from "../deps.ts";
import { fetchWithTimeout } from "./fetchWithTimeout.ts";
import { getUrlFromStringOrRequest, objectToQueryParams } from "./helpers.ts";
import type {
  FetchInput,
  ILimiterOptions,
  ILimiterRequestInit,
  IRequestEntity,
} from "./types.ts";

export class Limiter {
  #options: ILimiterOptions = {
    rps: 1,
  };

  #queue: IRequestEntity[] = [];
  #iterationStartTime = 0;
  #requestsPerIteration = 0;
  #loopIsWorking = false;

  #timeoutAfter429 = 0;

  constructor(options?: Partial<ILimiterOptions>) {
    if (options) {
      this.#options = { ...this.#options, ...options };
    }
  }

  #fetchThen(entity: IRequestEntity, response: Response) {
    if (this.#options.rt && response.status == 429) {
      this.#timeoutAfter429 = this.#options.rt(response);
    }

    if (this.#options.status && this.#options.status[response.status]) {
      this.#options.status[response.status](
        response,
        entity.resolve,
        entity.reject,
        () => {
          if (
            entity.init?.attempts != undefined &&
            entity.attempt < entity.init?.attempts
          ) {
            entity.attempt += 1;
            this.#queue.push(entity);
          } else {
            entity.reject(new Error("max attempts!"));
          }
        },
      );
    } else {
      entity.resolve(response);
    }
  }

  #fetchCatch(entity: IRequestEntity, error: Error) {
    if (
      entity.init?.attempts != undefined &&
      entity.attempt < entity.init?.attempts
    ) {
      entity.attempt += 1;
      this.#queue.push(entity);
    } else {
      entity.reject(error);
    }
  }

  #fetchFinally(enitty: IRequestEntity) {
    if (this.#requestsPerIteration > 0) this.#requestsPerIteration--;
  }

  async #loop() {
    this.#iterationStartTime = new Date().getTime();

    while (true) {
      if (this.#timeoutAfter429 > 0) {
        await delay(this.#timeoutAfter429);
        this.#timeoutAfter429 = 0;
      }

      if (this.#requestsPerIteration >= this.#options.rps) {
        await delay(0);
        continue;
      }

      const entity = this.#queue.shift();

      if (entity) {
        this.#requestsPerIteration++;
        // console.log(entity.input.toString());
        if (entity.init?.timeout && entity.init?.timeout > 0) {
          fetchWithTimeout(entity.input, entity.init.timeout, entity.init)
            .then((response) => this.#fetchThen(entity, response))
            .catch((error) => this.#fetchCatch(entity, error))
            .finally(() => this.#fetchFinally(entity));
        } else {
          fetch(entity.input, entity.init)
            .then((response) => this.#fetchThen(entity, response))
            .catch((error) => this.#fetchCatch(entity, error))
            .finally(() => this.#fetchFinally(entity));
        }
      }

      if (this.#queue.length == 0 && this.#requestsPerIteration == 0) {
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
        this.#requestsPerIteration = 0;
        this.#iterationStartTime = new Date().getTime();
      }
    }
  }

  static fetch(
    input: FetchInput,
    init?: ILimiterRequestInit,
  ): Promise<Response> {
    let promise = undefined as unknown as Promise<Response>;
    const url = new URL(getUrlFromStringOrRequest(input));
    if (init?.params) url.search = objectToQueryParams(init.params);

    if (init && init.timeout) {
      promise = fetchWithTimeout(url, init.timeout, init);
    } else {
      promise = fetch(url, init);
    }

    return promise;
  }

  #limitedFetch(
    input: FetchInput,
    init?: ILimiterRequestInit,
  ): Promise<Response> {
    const url = new URL(getUrlFromStringOrRequest(input));
    if (init?.params) url.search = objectToQueryParams(init.params);

    const promise = new Promise<Response>((resolve, reject) => {
      this.#queue.push({
        input: url,
        init,
        resolve,
        reject,
        attempt: 1,
      });
    });

    if (!this.#loopIsWorking) {
      this.#loopIsWorking = !this.#loopIsWorking;
      this.#loop();
    }

    return promise;
  }

  fetch(input: FetchInput, init?: ILimiterRequestInit): Promise<Response> {
    return (init && init.unlimited === true) || this.#options?.unlimited
      ? Limiter.fetch(input, init)
      : this.#limitedFetch(input, init);
  }
}
