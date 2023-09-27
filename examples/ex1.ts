import { delay } from "https://deno.land/std@0.202.0/async/delay.ts";
import { Limiter } from "../mod.ts";

const endpoint = "https://jsonplaceholder.typicode.com/todos/1";

const limiter = new Limiter({ rps: 5 });

for (let i = 30; i--;) {
  console.log(`send ${i}`);
  limiter.fetch(`${endpoint}`, {
    // timeout: 200,
    // interval: 1000,
    // attempts: 3,
  }).then((data) => console.log(`${i} ${data.status}`))
    .catch((err) => console.log(`${i} ${err}`))
    .finally(() => {
    });

  await delay(0);
}
