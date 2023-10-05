import fetchify from "../mod.ts";

const api = fetchify.create({
  limiter: {
    rps: 100,
    status: {
      200: (_response, _resolve, reject) => {
        reject(new Error("My Error!"));
      },
    },
  },

  baseURL: "https://jsonplaceholder.typicode.com/",
});

const res = await api.get("posts/1");

console.log(res);
