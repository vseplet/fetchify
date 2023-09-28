# fetchify

[![deno.land/x/luminous](https://shield.deno.dev/x/fetchify)](https://deno.land/x/fetchify)
[![popularity](https://deno.land/badge/fetchify/popularity)](https://deno.land/x/fetchify)<br>
![npm version](https://img.shields.io/npm/v/@sevapp/fetchify)
![npm downloads](https://img.shields.io/npm/dt/@sevapp/fetchify)<br>
![npm license](https://img.shields.io/npm/l/@sevapp/fetchify)

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
