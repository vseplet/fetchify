# fetchify

```ts
import { delay } from "https://deno.land/std@0.202.0/async/delay.ts";
import fetchify from "https://deno.land/x/fetchify@0.0.2/mod.ts";

const limiter = new fetchify.HTTPLimiter({
  interval: 1000,
});

for (let i = 10; i--;) {
  console.log(i);
  await limiter.fetch(`https://jsonplaceholder.typicode.com/todos/${i}`);
}

console.log("delay...");
await delay(2000);

for (let i = 10; i--;) {
  console.log(i);
  await limiter.fetch(`https://jsonplaceholder.typicode.com/todos/${i}`);
}
```
