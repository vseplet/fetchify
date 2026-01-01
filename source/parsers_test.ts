import { assertEquals, assertRejects } from "@std/assert";
import { v, z } from "../deps.ts";
import { json, jsonV, jsonZ, text } from "./parsers.ts";

Deno.test("text - parses response as text", async () => {
  const mockResponse = new Response("Hello, World!", { status: 200 });
  const { data, response } = await text(Promise.resolve(mockResponse));

  assertEquals(data, "Hello, World!");
  assertEquals(response.status, 200);
});

Deno.test("json - parses response as JSON", async () => {
  const mockResponse = new Response(JSON.stringify({ name: "John", age: 30 }), {
    status: 200,
  });
  const { data, response } = await json<{ name: string; age: number }>(
    Promise.resolve(mockResponse),
  );

  assertEquals(data.name, "John");
  assertEquals(data.age, 30);
  assertEquals(response.status, 200);
});

Deno.test("json - handles arrays", async () => {
  const mockResponse = new Response(JSON.stringify([1, 2, 3]), { status: 200 });
  const { data } = await json<number[]>(Promise.resolve(mockResponse));

  assertEquals(data, [1, 2, 3]);
});

Deno.test("jsonZ - validates with Zod schema", async () => {
  const schema = z.object({
    id: z.number(),
    name: z.string(),
  });

  const mockResponse = new Response(JSON.stringify({ id: 1, name: "Test" }), {
    status: 200,
  });

  const { data, response } = await jsonZ(Promise.resolve(mockResponse), schema);

  assertEquals(data.id, 1);
  assertEquals(data.name, "Test");
  assertEquals(response.status, 200);
});

Deno.test("jsonZ - throws on invalid data", async () => {
  const schema = z.object({
    id: z.number(),
    name: z.string(),
  });

  const mockResponse = new Response(
    JSON.stringify({ id: "not-a-number", name: "Test" }),
    { status: 200 },
  );

  await assertRejects(() => jsonZ(Promise.resolve(mockResponse), schema));
});

Deno.test("jsonV - validates with ValiBot schema", async () => {
  const schema = v.object({
    id: v.number(),
    name: v.string(),
  });

  const mockResponse = new Response(JSON.stringify({ id: 1, name: "Test" }), {
    status: 200,
  });

  const { data, response } = await jsonV(Promise.resolve(mockResponse), schema);

  assertEquals(data.id, 1);
  assertEquals(data.name, "Test");
  assertEquals(response.status, 200);
});

Deno.test("jsonV - throws on invalid data", async () => {
  const schema = v.object({
    id: v.number(),
    name: v.string(),
  });

  const mockResponse = new Response(
    JSON.stringify({ id: "not-a-number", name: "Test" }),
    { status: 200 },
  );

  await assertRejects(() => jsonV(Promise.resolve(mockResponse), schema));
});
