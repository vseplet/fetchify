# fetchify

[![deno.land/x/luminous](https://shield.deno.dev/x/fetchify)](https://deno.land/x/fetchify)
[![popularity](https://deno.land/badge/fetchify/popularity)](https://deno.land/x/fetchify)<br>
![npm version](https://img.shields.io/npm/v/@sevapp/fetchify)
![npm downloads](https://img.shields.io/npm/dt/@sevapp/fetchify)<br>
![npm license](https://img.shields.io/npm/l/@sevapp/fetchify)

```ts
import fetchify from "https://deno.land/x/fetchify/mod.ts";

const jph = fetchify.create({
  limiter: {
    rps: 10,
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
