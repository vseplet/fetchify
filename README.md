# fetchify

[![JSR](https://jsr.io/badges/@vseplet/fetchify)](https://jsr.io/@vseplet/fetchify)

## 👋 👋 ATTENTION!

> This package is under development and will be frequently updated. The author
> would appreciate any help, advice, and pull requests! Thank you for your
> understanding 😊

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
  - [Quick Start](#quick-start)
  - [Usage](#usage)
    - [Timeout](#timeout)
    - [Rate-limit](#rate-limit)
    - [Retries](#retries)
    - [Parsing and validation](#parsing-and-validation)
  - [API Reference](#api-reference)
    - [fetchify(input, init?)](#fetchifyinput-init)
    - [fetchify.create(config)](#fetchifycreateconfig)
    - [Parsers](#parsers)
  - [TypeScript Types](#typescript-types)

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

## Quick Start

The first thing available to you is the **fetchify** function

```ts
const json = await (await fetchify("https://catfact.ninja/fact")).json();
console.log(json);
```

## Usage

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

## API Reference

### fetchify(input, init?)

The main function for making HTTP requests with extended options.

**Parameters:**

- `input`: `string | URL | Request` - The URL or Request object
- `init?`: `ILimiterRequestInit` - Optional request configuration

**Options (extends `RequestInit`):**

- `timeout?: number` - Request timeout in milliseconds
- `attempts?: number` - Number of retry attempts on failure
- `interval?: number` - Interval between retry attempts in milliseconds
- `unlimited?: boolean` - Bypass rate limiting for this request
- `params?: IQueryParams` - Query parameters to append to URL

**Returns:** `Promise<Response>`

**Example:**

```ts
import fetchify from "@vseplet/fetchify";

// Simple request
const response = await fetchify("https://api.example.com/data");

// With timeout
const response = await fetchify("https://api.example.com/data", {
  timeout: 5000,
});

// With query params
const response = await fetchify("https://api.example.com/data", {
  params: { page: 1, limit: 10 },
});

// With retries
const response = await fetchify("https://api.example.com/data", {
  attempts: 3,
  interval: 1000,
});
```

### fetchify.create(config)

Creates a configured instance with base URL, headers, and rate limiting.

**Parameters:**

- `config?`: `IFetchifyConfig` - Configuration object

**Configuration Options:**

- `baseURL?: string | URL | Request` - Base URL for all requests
- `headers?: HeadersInit` - Default headers for all requests
- `limiter?: ILimiterOptions` - Rate limiting configuration
  - `rps?: number` - Requests per second (default: 1)
  - `unlimited?: boolean` - Disable rate limiting globally
  - `rt?: (response: Response) => number` - Rate limit handler, returns delay in
    ms
  - `status?: { [code: number]: StatusHandler }` - Custom handlers for specific
    status codes

**Returns:** `Fetchify` instance with methods: `get`, `post`, `put`, `delete`,
`head`, `patch`

**Example:**

```ts
import fetchify from "@vseplet/fetchify";

const api = fetchify.create({
  baseURL: "https://api.example.com",
  headers: {
    "Authorization": "Bearer token",
    "Content-Type": "application/json",
  },
  limiter: {
    rps: 5, // 5 requests per second
    rt: (response) => {
      // Handle 429 (Too Many Requests)
      const retryAfter = response.headers.get("Retry-After");
      return retryAfter ? parseInt(retryAfter) * 1000 : 1000;
    },
    status: {
      404: (response, resolve, reject, retry) => {
        console.log("Resource not found");
        reject(new Error("Not found"));
      },
      500: (response, resolve, reject, retry) => {
        console.log("Server error, retrying...");
        retry(); // Retry the request
      },
    },
  },
});

// All HTTP methods available
await api.get("/users");
await api.post("/users", { body: JSON.stringify({ name: "John" }) });
await api.put("/users/1", { body: JSON.stringify({ name: "Jane" }) });
await api.patch("/users/1", { body: JSON.stringify({ age: 30 }) });
await api.delete("/users/1");
await api.head("/users");

// Bypass rate limiting for specific request
await api.get("/users", { unlimited: true });
```

### Parsers

Helper functions for parsing and validating responses.

#### text(promise)

Parses response as plain text.

**Parameters:**

- `promise`: `Promise<Response>` - Fetch promise

**Returns:** `Promise<{ data: string, response: Response }>`

**Example:**

```ts
import fetchify, { text } from "@vseplet/fetchify";

const { data, response } = await text(
  fetchify("https://api.example.com/data.txt"),
);

console.log(data); // string content
console.log(response.status); // 200
```

#### json(promise)

Parses response as JSON.

**Parameters:**

- `promise`: `Promise<Response>` - Fetch promise

**Returns:** `Promise<{ data: T, response: Response }>`

**Example:**

```ts
import fetchify, { json } from "@vseplet/fetchify";

const { data, response } = await json(
  fetchify("https://api.example.com/users"),
);

console.log(data); // parsed JSON object
```

#### jsonZ(promise, schema)

Parses response as JSON and validates with Zod schema.

**Parameters:**

- `promise`: `Promise<Response>` - Fetch promise
- `schema`: `z.ZodSchema` - Zod validation schema

**Returns:** `Promise<{ data: T, response: Response }>`

**Throws:** `ZodError` if validation fails

**Example:**

```ts
import fetchify, { jsonZ, z } from "@vseplet/fetchify";

const schema = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

const { data, response } = await jsonZ(
  fetchify("https://jsonplaceholder.typicode.com/todos/1"),
  schema,
);

console.log(data.id); // type-safe access
```

#### jsonV(promise, schema)

Parses response as JSON and validates with ValiBot schema.

**Parameters:**

- `promise`: `Promise<Response>` - Fetch promise
- `schema`: `v.BaseSchema` - ValiBot validation schema

**Returns:** `Promise<{ data: T, response: Response }>`

**Throws:** `ValiError` if validation fails

**Example:**

```ts
import fetchify, { jsonV, v } from "@vseplet/fetchify";

const schema = v.object({
  id: v.number(),
  title: v.string(),
  completed: v.boolean(),
});

const { data, response } = await jsonV(
  fetchify("https://jsonplaceholder.typicode.com/todos/1"),
  schema,
);

console.log(data.id); // type-safe access
```

## TypeScript Types

All types are exported from the package:

```ts
import type {
  FetchInput,
  IFetchifyConfig,
  ILimiterOptions,
  ILimiterRequestInit,
  IQueryParams,
  RateLimitExceededHandler,
  StatusHandler,
} from "@vseplet/fetchify";
```

### Core Types

```ts
// Input types for fetch
type FetchInput = URL | Request | string;

// Query parameters
interface IQueryParams {
  [name: string]: string | number | boolean;
}

// Request options
interface ILimiterRequestInit extends RequestInit {
  attempts?: number; // Number of retry attempts
  interval?: number; // Interval between retries (ms)
  timeout?: number; // Request timeout (ms)
  unlimited?: boolean; // Bypass rate limiting
  params?: IQueryParams; // Query parameters
}

// Rate limit handler
type RateLimitExceededHandler = (response: Response) => number;

// Status code handler
type StatusHandler = (
  response: Response,
  resolve: (value: Response) => void,
  reject: (value: Error) => void,
  retry: () => void,
) => void;

// Limiter configuration
interface ILimiterOptions {
  unlimited?: boolean; // Disable rate limiting
  rps?: number; // Requests per second
  rt?: RateLimitExceededHandler; // Handle 429 errors
  status?: { // Custom status handlers
    [code: number]: StatusHandler;
  };
}

// Fetchify configuration
interface IFetchifyConfig {
  limiter?: ILimiterOptions; // Rate limiting config
  baseURL?: FetchInput; // Base URL
  headers?: HeadersInit; // Default headers
}
```
