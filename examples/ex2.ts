import { delay } from "../deps.ts";
import fetchify from "../mod.ts";

const api = fetchify.create({
  limiter: {
    rps: 1,
    "429": () => 1000,
  },

  baseURL: "https://httpbin.org",
});

for (let i = 10; i--;) {
  api.get(`status/429`).then((data) => console.log(`${i} ${data.status}`))
    .catch((err) => console.log(`${i + 10} ${err}`));
}

for (let i = 10; i--;) {
  api.get(`status/200`).then((data) => console.log(`${i} ${data.status}`))
    .catch((err) => console.log(`${i} ${err}`));
}
