# fetchify

[![deno.land/x/luminous](https://shield.deno.dev/x/fetchify)](https://deno.land/x/fetchify)
[![popularity](https://deno.land/badge/fetchify/popularity)](https://deno.land/x/fetchify)
![npm version](https://img.shields.io/npm/v/@sevapp/fetchify)
![npm downloads](https://img.shields.io/npm/dt/@sevapp/fetchify)
![npm license](https://img.shields.io/npm/l/@sevapp/fetchify)

✅ [DENO RU COMMUNITY](https://t.me/+3rL7e9JzPLRhZTli)

This package is designed to make the process of interacting with various APIs
that have strict limitations more convenient and careful. For example, this
could be APIs like Notion or Telegram, which have stringent limits.

- [Import](#import)
  - [deno](#deno)
  - [nodejs](#nodejs)
- [Usage](#usage)
  - [Timeout](#timeout)
  - [Rate-limit](#rate-limit)
  - [Retries](#retries)
  - [Parsing and validation](#parsing-and-validation)
- [LICENCE](#licence)

## 👋 👋 ATTENTION!

> This package is under development and will be frequently updated. The author
> would appreciate any help, advice, and pull requests! Thank you for your
> understanding 😊

## Import

#### Deno:

> From [deno.land/x](https://deno.land/x/fetchify):
>
> ```ts
> import fetchify from "https://deno.land/x/fetchify@0.2.8/mod.ts";
> ```
>
> Or [esm.sh](esm.sh):
>
> ```ts
> import fetchify from "https://esm.sh/gh/sevapp/fetchify@0.2.8/mod.ts";
> ```

#### Node.JS:

> Install from [npm](https://www.npmjs.com/package/@sevapp/fetchify):
>
> ```bash
> npm i --save @sevapp/fetchify
> ```
>
> And import:
>
> ```ts
> import fetchify from "fetchify";
> ```

## Usage:

The first thing available to you is the **fetchify** function

```ts
const json = await (await fetchify("https://catfact.ninja/fact")).json();
console.log(json);
```

### Timeout
This function has a similar interface to the classic **fetch** but extends it
with additional options, for example:

```ts
const json = await (await fetchify(
  "https://catfact.ninja/fact",
  {
    timeout: 1000, // Now, the waiting for a response will be interrupted after 1000 ms.
  },
)).json();

console.log(json);
```

### Rate-limit
But you can also create an instance with a set base URL and rate-limiting
constraints:

```ts
const jph = fetchify.create({
  limiter: {
    // Number of requests per second
    rps: 3,
    // You can handle the occurrence of a 429 error
    // and return the time in ms that the request loop should delay
    "429": (response) => 1000,
  },
  baseURL: "https://jsonplaceholder.typicode.com",
  headers: {
    "hello": "world",
  },
});

for (let i = 30; i--;) {
  console.log(`send ${i}`);
  // All basic methods supported: get post put delete head patch
  jph.get(`/posts/${i}`).then((data) => console.log(`${i} ${data.status}`))
    .catch((err) => console.log(`${i} ${err}`))
    .finally(() => {
    });
}
```

### Retries
Yes, all methods comply with the **fetch** interface but also extend it with
additional options, for example:

```ts
await jph.get(`/posts/10`, {
  // Number of attempts
  attempts: 10
  // Time after which we stop waiting for a response
  timeout: 1000
});
```

If you need to make a request to the configured **baseURL** but not through the
request queue, you can add the flag:

```ts
await jph.get(`/posts/10`, { unlimited: true });
```

### Parsing and validation
If you need to, you can try to parse JSON and validate it using [Zod](https://github.com/colinhacks/zod):
```ts
import fetchify, { jsonZ, z } from "fetchify";

const schema = z.object({
  id: z.string(), // there should actually be a z.number() here!
  title: z.string(),
  body: z.string(),
  userId: z.number(),
});

const { data, response } = await jsonZ(
  fetchify("https://jsonplaceholder.typicode.com/posts/1"),
  schema,
);
```

And get the error:
```
error: Uncaught (in promise) ZodError: [
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "number",
    "path": [
      "id"
    ],
    "message": "Expected string, received number"
  }
]
```

Or using [ValiBot](https://github.com/fabian-hiller/valibot):
```ts
import fetchify, { jsonV, v } from "fetchify";

const schema = v.object({
  id: v.number(), // v.number() is valid
  title: v.string(),
  body: v.string(),
  userId: v.number(),
});

const { data, response } = await jsonV(
  fetchify("https://jsonplaceholder.typicode.com/posts/1"),
  schema,
);

console.log(data);
// {
//   id: 1,
//   title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
//   body: "quia et suscipit\n" +
//     "suscipit recusandae consequuntur expedita et cum\n" +
//     "reprehenderit molestiae ut ut quas"... 58 more characters,
//   userId: 1
// }

```

## LICENCE

[LGPL-2.1](https://github.com/sevapp/fetchify/blob/main/LICENSE)
