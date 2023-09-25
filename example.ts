import { delay } from "https://deno.land/std@0.202.0/async/delay.ts";
import { HTTPLimiter } from "./src/HTTPLimiter.ts";

const limiter = new HTTPLimiter({
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
