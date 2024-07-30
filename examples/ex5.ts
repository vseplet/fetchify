import fetchify from "../source/mod.ts";

const api = fetchify.create({
  limiter: {
    unlimited: true,
    rps: 1,
    status: {
      404: (response, resolve, reject, retry) => {
        retry();
      },
    },
  },

  baseURL: "https://jsonplaceholder.typicode.com/posts",
});

const res = await api.get("/1", { attempts: 10 });

console.log(res);
