import fetchify from "../mod.ts";

const endpoint = "";

const limit = new fetchify.HTTPLimiter({ rps: 3 });

limit.fetch(`${endpoint}`, {
  timeout: 100,
  attempts: 5,
}).then((data) => console.log(data))
  .catch((err) => {});

// for (let i = 1; i--;) {
//   console.log(`push to queue ${i}`);
//   limit.fetch(`${endpoint}`, {
//     timeout: 1000,
//     attempts: 2,
//   }).then((data) => console.log(data))
//     .catch((err) => console.log(`${i} ${err}`))
//     .finally(() => {
//     });
// }
