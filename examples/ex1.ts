import fetchify from "../mod.ts";

const endpoint = "https://jsonplaceholder.typicode.com/todos/1";

const limiter = new fetchify.Limiter({ rps: 1 });

limiter.fetch(`${endpoint}`, {
  timeout: 50,
  unlimited: false,
  attempts: 10,
}).then((data) => console.log(data.statusText))
  .catch((err) => console.error(err));

// for (let i = 10; i--;) {
//   limiter.fetch(`${endpoint}`, {
//     timeout: 200,
//     // interval: 1000,
//     // attempts: 3,
//   }).then((data) => console.log(`${i} ${data.status}`))
//     .catch((err) => console.log(`${i} ${err}`))
//     .finally(() => {
//     });
// }
