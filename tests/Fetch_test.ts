import { assertEquals } from "@std/assert";
import { Fetchify } from "@/Fetch.ts";

function mockFetch() {
  const originalFetch = globalThis.fetch;
  const calls: { url: string; method: string; headers?: HeadersInit }[] = [];

  globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({
      url: input.toString(),
      method: init?.method || "GET",
      headers: init?.headers,
    });
    return Promise.resolve(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
  };

  return {
    calls,
    cleanup: () => {
      globalThis.fetch = originalFetch;
    },
  };
}

const testOpts = { sanitizeOps: false, sanitizeResources: false };

Deno.test("Fetchify - GET request", testOpts, async () => {
  const { calls, cleanup } = mockFetch();
  const client = new Fetchify();

  try {
    const response = await client.get("https://example.com/api/users");
    assertEquals(response.status, 200);
    assertEquals(calls[0].method, "GET");
    assertEquals(calls[0].url, "https://example.com/api/users");
  } finally {
    cleanup();
  }
});

Deno.test("Fetchify - POST request", testOpts, async () => {
  const { calls, cleanup } = mockFetch();
  const client = new Fetchify();

  try {
    const response = await client.post("https://example.com/api/users");
    assertEquals(response.status, 200);
    assertEquals(calls[0].method, "POST");
  } finally {
    cleanup();
  }
});

Deno.test("Fetchify - PUT request", testOpts, async () => {
  const { calls, cleanup } = mockFetch();
  const client = new Fetchify();

  try {
    const response = await client.put("https://example.com/api/users/1");
    assertEquals(response.status, 200);
    assertEquals(calls[0].method, "PUT");
  } finally {
    cleanup();
  }
});

Deno.test("Fetchify - DELETE request", testOpts, async () => {
  const { calls, cleanup } = mockFetch();
  const client = new Fetchify();

  try {
    const response = await client.delete("https://example.com/api/users/1");
    assertEquals(response.status, 200);
    assertEquals(calls[0].method, "DELETE");
  } finally {
    cleanup();
  }
});

Deno.test("Fetchify - HEAD request", testOpts, async () => {
  const { calls, cleanup } = mockFetch();
  const client = new Fetchify();

  try {
    const response = await client.head("https://example.com/api/users");
    assertEquals(response.status, 200);
    assertEquals(calls[0].method, "HEAD");
  } finally {
    cleanup();
  }
});

Deno.test("Fetchify - PATCH request", testOpts, async () => {
  const { calls, cleanup } = mockFetch();
  const client = new Fetchify();

  try {
    const response = await client.patch("https://example.com/api/users/1");
    assertEquals(response.status, 200);
    assertEquals(calls[0].method, "PATCH");
  } finally {
    cleanup();
  }
});

Deno.test("Fetchify - uses baseURL", testOpts, async () => {
  const { calls, cleanup } = mockFetch();
  const client = new Fetchify({
    baseURL: "https://api.example.com",
  });

  try {
    await client.get("/users");
    assertEquals(calls[0].url, "https://api.example.com/users");
  } finally {
    cleanup();
  }
});

Deno.test("Fetchify - uses default headers", testOpts, async () => {
  const { calls, cleanup } = mockFetch();
  const client = new Fetchify({
    headers: {
      Authorization: "Bearer token123",
      "Content-Type": "application/json",
    },
  });

  try {
    await client.get("https://example.com/api");
    assertEquals(
      (calls[0].headers as Record<string, string>)?.["Authorization"],
      "Bearer token123",
    );
  } finally {
    cleanup();
  }
});

Deno.test(
  "Fetchify - combines baseURL with path correctly",
  testOpts,
  async () => {
    const { calls, cleanup } = mockFetch();
    const client = new Fetchify({
      baseURL: "https://api.example.com/v1",
    });

    try {
      await client.get("/users/123");
      assertEquals(calls[0].url, "https://api.example.com/v1/users/123");
    } finally {
      cleanup();
    }
  },
);

Deno.test("Fetchify - with rate limiting config", testOpts, async () => {
  const { cleanup } = mockFetch();
  const client = new Fetchify({
    limiter: { rps: 5 },
  });

  try {
    const response = await client.get("https://example.com/api");
    assertEquals(response.status, 200);
  } finally {
    cleanup();
  }
});

Deno.test("Fetchify - multiple requests in sequence", testOpts, async () => {
  const { calls, cleanup } = mockFetch();
  const client = new Fetchify({
    baseURL: "https://api.example.com",
  });

  try {
    await client.get("/users");
    await client.post("/users");
    await client.delete("/users/1");

    assertEquals(calls.length, 3);
    assertEquals(calls[0].method, "GET");
    assertEquals(calls[1].method, "POST");
    assertEquals(calls[2].method, "DELETE");
  } finally {
    cleanup();
  }
});
