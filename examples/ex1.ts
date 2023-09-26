import fetchify from "../mod.ts";

const endpoint = ""; // https://jsonplaceholder.typicode.com/todos/1

const limit = new fetchify.HTTPLimiter({ rps: 2 });

// limit.fetch(`${endpoint}`, {
//   timeout: 200,
//   attempts: 3,
// }).then((data) => console.log("ok"))
//   .catch((err) => console.error(err));

for (let i = 1; i--;) {
  console.log(`push to queue ${i}`);
  limit.fetch(`${endpoint}`, {
    timeout: 200,
    attempts: 2,
  }).then((data) => console.log(data))
    .catch((err) => console.log(`${i} ${err}`))
    .finally(() => {
    });
}
