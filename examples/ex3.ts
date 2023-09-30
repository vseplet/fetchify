import fetchify, { jsonZ, z } from "../mod.ts";

const schema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number(),
});

const { data, response } = await jsonZ(
  fetchify("https://jsonplaceholder.typicode.com/posts/1"),
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
