# fetchify

```ts
import { delay } from "https://deno.land/std@0.202.0/async/delay.ts";
import fetchify from "https://deno.land/x/fetchify@0.0.2/mod.ts";

const endpoint = 'https://jsonplaceholder.typicode.com';

const limit = new fetchify.HTTPLimiter({
  rps: 3
});

for (let i = 20; i --;) {
  console.log(`push to queue ${i}`)
  limit.fetch(`${endpoint}/posts/${i}`).finally(() => {
    console.log(`finally ${i}`)
  })
}
```
