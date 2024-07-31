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

  baseURL: "https://jsonplaceholder.typicode.com/posts/1/",
});

const res = await api.get("", { attempts: 10 });

console.log(res);
