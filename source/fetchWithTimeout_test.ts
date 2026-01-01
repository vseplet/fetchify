import {
  assertEquals,
  assertRejects,
} from "jsr:@std/assert@1";
import { fetchWithTimeout } from "./fetchWithTimeout.ts";

Deno.test("fetchWithTimeout - successful request within timeout", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = () =>
    Promise.resolve(new Response(JSON.stringify({ success: true }), { status: 200 }));

  try {
    const response = await fetchWithTimeout("https://example.com", 5000);
    assertEquals(response.status, 200);
    const data = await response.json();
    assertEquals(data.success, true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("fetchWithTimeout - aborts on timeout", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (_input: RequestInfo | URL, init?: RequestInit) => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        resolve(new Response("", { status: 200 }));
      }, 1000);

      init?.signal?.addEventListener("abort", () => {
        clearTimeout(timeoutId);
        reject(new DOMException("The operation was aborted.", "AbortError"));
      });
    });
  };

  try {
    await assertRejects(
      () => fetchWithTimeout("https://example.com", 50),
      DOMException,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("fetchWithTimeout - passes init options to fetch", async () => {
  const originalFetch = globalThis.fetch;
  let capturedInit: RequestInit | undefined;

  globalThis.fetch = (_input: RequestInfo | URL, init?: RequestInit) => {
    capturedInit = init;
    return Promise.resolve(new Response("", { status: 200 }));
  };

  try {
    await fetchWithTimeout("https://example.com", 5000, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    assertEquals(capturedInit?.method, "POST");
    assertEquals(
      (capturedInit?.headers as Record<string, string>)?.["Content-Type"],
      "application/json",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
