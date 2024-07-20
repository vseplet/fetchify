# fetchify
[![JSR](https://jsr.io/badges/@vseplet/fetchify)](https://jsr.io/@vseplet/fetchify)

✅ [DENO RU COMMUNITY](https://t.me/+3rL7e9JzPLRhZTli)

This package is designed to make the process of interacting with various APIs
that have strict limitations more convenient and careful. For example, this
could be APIs like Notion or Telegram, which have stringent limits.

- [fetchify](#fetchify)
  - [👋 👋 ATTENTION!](#--attention)
  - [Examples](#examples)
  - [Import](#import)
      - [Deno:](#deno)
      - [Node.JS:](#nodejs)
  - [Usage:](#usage)
    - [Timeout](#timeout)
    - [Rate-limit](#rate-limit)
    - [Retries](#retries)
    - [Parsing and validation](#parsing-and-validation)
  - [DONATE](#donate)

## 👋 👋 ATTENTION!

> This package is under development and will be frequently updated. The author
> would appreciate any help, advice, and pull requests! Thank you for your
> understanding 😊

## Examples

1. Gist
   [deno telegram mailer](https://gist.github.com/sevapp/876e76399c2f88129f5259e17afe9582) +
   article
   [💌 Safe message sending script in Telegram with just 49 lines of code? Really?](https://dev.to/sevapp/safe-message-sending-script-in-telegram-with-just-49-lines-of-code-really-18jf)

## Import

#### Deno:
```bash
deno add @vseplet/fetchify
```
#### Node.JS:
```bash
npx jsr add @vseplet/fetchify
```
And import:
```ts
import fetchify from "@vseplet/fetchify";
```

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
    rt: (response) => 1000,
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

If you need to, you can try to parse JSON and validate it using
[Zod](https://github.com/colinhacks/zod):

```ts
import fetchify, { jsonZ, z } from "@vseplet/fetchify";

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
import fetchify, { jsonV, v } from "@vseplet/fetchify";

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

## DONATE

🫶 You can support me and my work in the following ways: <br> **TON**:
`EQBiaSPuG33CuKXHClwsVvA-SazmLmtiTfXV7dQnqJdIlGgI`<br> **USDT (TRC 20)**
`(TRC20): TGPWzEiQjMYHjZx4fb3SDSumiSXdmjE4ZR`<br> **BTC**:
`bc1qq37svf4h8sg5qjsv99n9jf3r45dtd5yf5mdpc5`<br> **ETH**:
`0xAdc58F26cA3dCc01256cF1BeF6221f4bcaa3c660`<br> **SOL**:
`BckFFoxZw36ABbNS8Fc66LCdzJhu4ZwQANRdq49XmqKw`<br>
