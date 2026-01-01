import { assertEquals } from "@std/assert";
import { Limiter } from "@/Limiter.ts";

function mockFetch(response: Response = new Response("", { status: 200 })) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => Promise.resolve(response);
  return () => {
    globalThis.fetch = originalFetch;
  };
}

const testOpts = { sanitizeOps: false, sanitizeResources: false };

Deno.test(
  "Limiter.fetch - static method makes unlimited request",
  testOpts,
  async () => {
    const cleanup = mockFetch(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );

    try {
      const response = await Limiter.fetch("https://example.com/api");
      assertEquals(response.status, 200);
    } finally {
      cleanup();
    }
  },
);

Deno.test(
  "Limiter.fetch - static method adds query params",
  testOpts,
  async () => {
    const originalFetch = globalThis.fetch;
    let capturedUrl = "";

    globalThis.fetch = (input: RequestInfo | URL) => {
      capturedUrl = input.toString();
      return Promise.resolve(new Response("", { status: 200 }));
    };

    try {
      await Limiter.fetch("https://example.com/api", {
        params: { page: 1, limit: 10 },
      });
      assertEquals(capturedUrl, "https://example.com/api?page=1&limit=10");
    } finally {
      globalThis.fetch = originalFetch;
    }
  },
);

Deno.test("Limiter - instance fetch with rate limiting", testOpts, async () => {
  const cleanup = mockFetch();
  const limiter = new Limiter({ rps: 5 });

  try {
    const response = await limiter.fetch("https://example.com/api");
    assertEquals(response.status, 200);
  } finally {
    cleanup();
  }
});

Deno.test(
  "Limiter - unlimited option bypasses rate limiting",
  testOpts,
  async () => {
    const cleanup = mockFetch();
    const limiter = new Limiter({ rps: 1 });

    try {
      const response = await limiter.fetch("https://example.com/api", {
        unlimited: true,
      });
      assertEquals(response.status, 200);
    } finally {
      cleanup();
    }
  },
);

Deno.test("Limiter - adds query params to request", testOpts, async () => {
  const originalFetch = globalThis.fetch;
  let capturedUrl = "";

  globalThis.fetch = (input: RequestInfo | URL) => {
    capturedUrl = input.toString();
    return Promise.resolve(new Response("", { status: 200 }));
  };

  const limiter = new Limiter({ rps: 5 });

  try {
    await limiter.fetch("https://example.com/api", {
      params: { foo: "bar" },
    });
    assertEquals(capturedUrl, "https://example.com/api?foo=bar");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test(
  "Limiter - handles multiple concurrent requests",
  testOpts,
  async () => {
    const cleanup = mockFetch();
    const limiter = new Limiter({ rps: 10 });

    try {
      const promises = [
        limiter.fetch("https://example.com/api/1"),
        limiter.fetch("https://example.com/api/2"),
        limiter.fetch("https://example.com/api/3"),
      ];

      const responses = await Promise.all(promises);
      assertEquals(responses.length, 3);
      responses.forEach((r) => assertEquals(r.status, 200));
    } finally {
      cleanup();
    }
  },
);

Deno.test("Limiter - custom status handler", testOpts, async () => {
  const cleanup = mockFetch(new Response("Not Found", { status: 404 }));
  let handlerCalled = false;

  const limiter = new Limiter({
    rps: 5,
    status: {
      404: (response, resolve) => {
        handlerCalled = true;
        resolve(response);
      },
    },
  });

  try {
    const response = await limiter.fetch("https://example.com/api");
    assertEquals(handlerCalled, true);
    assertEquals(response.status, 404);
  } finally {
    cleanup();
  }
});

Deno.test("Limiter - retry on failure", testOpts, async () => {
  let attempts = 0;
  const originalFetch = globalThis.fetch;

  globalThis.fetch = () => {
    attempts++;
    if (attempts < 3) {
      return Promise.reject(new Error("Network error"));
    }
    return Promise.resolve(new Response("", { status: 200 }));
  };

  const limiter = new Limiter({ rps: 5 });

  try {
    const response = await limiter.fetch("https://example.com/api", {
      attempts: 3,
    });
    assertEquals(response.status, 200);
    assertEquals(attempts, 3);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("Limiter - global unlimited option", testOpts, async () => {
  const cleanup = mockFetch();
  const limiter = new Limiter({ unlimited: true });

  try {
    const response = await limiter.fetch("https://example.com/api");
    assertEquals(response.status, 200);
  } finally {
    cleanup();
  }
});
