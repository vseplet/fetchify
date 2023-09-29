# fetchify

[![deno.land/x/luminous](https://shield.deno.dev/x/fetchify)](https://deno.land/x/fetchify) [![popularity](https://deno.land/badge/fetchify/popularity)](https://deno.land/x/fetchify)
![npm version](https://img.shields.io/npm/v/@sevapp/fetchify) ![npm downloads](https://img.shields.io/npm/dt/@sevapp/fetchify) ![npm license](https://img.shields.io/npm/l/@sevapp/fetchify)


This package is designed to make the process of interacting with various APIs that have strict limitations more convenient and careful. For example, this could be APIs like Notion or Telegram, which have stringent limits.

## 👋 👋 ATTENTION!
> This package is under development and will be frequently updated. The author would appreciate any help, advice, and pull requests! Thank you for your understanding 😊

## Import

#### Deno:
> From [deno.land/x](https://deno.land/x/fetchify):
> ```ts
> import fetchify from "https://deno.land/x/fetchify@0.2.5/mod.ts";
> ```
> Or [esm.sh](esm.sh):
> ```ts
> import fetchify from "https://esm.sh/gh/sevapp/fetchify@0.2.5/mod.ts"
> ```

#### Node.JS:
> Install from [npm](https://www.npmjs.com/package/@sevapp/fetchify):
> ```bash
> npm i --save @sevapp/fetchify
> ``` 
> And import:
> ```ts
> import fetchify from "fetchify";
> ```

## Usage:
The first thing available to you is the **fetchify** function
```ts
const json = await (await fetchify("https://catfact.ninja/fact")).json();
console.log(json);
```

This function has a similar interface to the classic **fetch** but extends it with additional options, for example:
```ts
const json = await (await fetchify(
  "https://catfact.ninja/fact",
  {
    timeout: 1000, // Now, the waiting for a response will be interrupted after 1000 ms.
  }
)).json();

console.log(json);
```

But you can also create an instance with a set base URL and rate-limiting constraints:
```ts
const jph = fetchify.create({
  limiter: {
    rps: 3,
    interval: 10,
  },
  baseURL: "https://jsonplaceholder.typicode.com",
  headers: {
    "hello": "world",
  },
});

for (let i = 30; i--;) {
  console.log(`send ${i}`);

  jph.get(`/posts/${i}`).then((data) => console.log(`${i} ${data.status}`))
    .catch((err) => console.log(`${i} ${err}`))
    .finally(() => {
    });
}
```

## LICENCE

[LGPL-2.1](https://github.com/sevapp/fetchify/blob/main/LICENSE)
