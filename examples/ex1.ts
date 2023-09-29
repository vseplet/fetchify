import { delay } from "https://deno.land/std@0.202.0/async/delay.ts";
import { Limiter } from "../mod.ts";

const endpoint = "https://jsonplaceholder.typicode.com/asdasd/1";

const limiter = new Limiter({
  rps: 50,

  "429": (response) => {
    return response.headers.get("retry_after") as unknown as number * 1000;
  },
});

for (let i = 100; i--;) {
  console.log(`send ${i}`);
  limiter.fetch(`${endpoint}`, {}).then((data) =>
    console.log(`${i} ${data.status}`)
  )
    .catch((err) => console.log(`${i} ${err}`))
    .finally(() => {
    });

  await delay(0);
}
