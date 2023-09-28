import fetchify from "../mod.ts";

const api = fetchify.create({
  limiter: {
    rps: 10,
    interval: 10,
  },
  baseURL: "https://jsonplaceholder.typicode.com",
});

for (let i = 30; i--;) {
  console.log(`send ${i}`);
  api.get(`/posts/${i}`).then((data) => console.log(`${i} ${data.status}`))
    .catch((err) => console.log(`${i} ${err}`))
    .finally(() => {
    });
}
