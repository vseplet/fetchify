import fetchify from "../mod.ts";

const api = fetchify.create({
  limiter: {
    rps: 1,
    status: {
      404: (response, resolve, reject, retry) => {
        retry();
      },
    },
  },

  baseURL: "https://jsonplaceholder.typicode.com/",
});

const res = await api.get("postsds/1", { attempts: 10 });

console.log(res);
