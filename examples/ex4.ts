import fetchify, { jsonV, v } from "../source/mod.ts";

const schema = v.object({
  id: v.number(), // v.number() is valid
  title: v.string(),
  body: v.string(),
  userId: v.number(),
});

const { data, response } = await jsonV(
  fetchify("https://jsonplaceholder.typicode.com/posts/1", {
    params: {
      "g": 10,
      "d": true,
    },
  }),
  schema,
);

console.log(data);

// {
//   id: 1,
//   title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
//   body: "quia et suscipit\n" +
//     "suscipit recusandae consequuntur expedita et cum\n" +
//     "reprehenderit molestiae ut ut quas"... 58 more characters,
//   userId: 1
// }
