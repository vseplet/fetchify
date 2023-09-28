# fetchify

[![deno.land/x/luminous](https://shield.deno.dev/x/fetchify)](https://deno.land/x/fetchify)
[![popularity](https://deno.land/badge/fetchify/popularity)](https://deno.land/x/fetchify)<br>
![npm version](https://img.shields.io/npm/v/@sevapp/fetchify)
![npm downloads](https://img.shields.io/npm/dt/@sevapp/fetchify)<br>
![npm license](https://img.shields.io/npm/l/@sevapp/fetchify)

```ts
import { Limiter } from "https://deno.land/x/fetchify@0.2.4/mod.ts";

const endpoint = "https://jsonplaceholder.typicode.com";

const limit = new Limiter({
  rps: 3,
});

for (let i = 20; i--;) {
  console.log(`push to queue ${i}`);
  limit.fetch(`${endpoint}/posts/${i}`).finally(() => {
    console.log(`finally ${i}`);
  });
}
```
