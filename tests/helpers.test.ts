import { assertEquals } from "@std/assert";
import {
  combineURL,
  getUrlFromStringOrRequest,
  objectToQueryParams,
} from "@/helpers.ts";

Deno.test("objectToQueryParams - converts object to query string", () => {
  const params = { foo: "bar", baz: 123, active: true };
  const result = objectToQueryParams(params);
  assertEquals(result, "foo=bar&baz=123&active=true");
});

Deno.test("objectToQueryParams - encodes special characters", () => {
  const params = { query: "hello world", special: "a&b=c" };
  const result = objectToQueryParams(params);
  assertEquals(result, "query=hello%20world&special=a%26b%3Dc");
});

Deno.test("objectToQueryParams - handles empty object", () => {
  const result = objectToQueryParams({});
  assertEquals(result, "");
});

Deno.test("getUrlFromStringOrRequest - returns string as is", () => {
  const result = getUrlFromStringOrRequest("https://example.com/api");
  assertEquals(result, "https://example.com/api");
});

Deno.test("getUrlFromStringOrRequest - extracts URL from URL object", () => {
  const url = new URL("https://example.com/api");
  const result = getUrlFromStringOrRequest(url);
  assertEquals(result, "https://example.com/api");
});

Deno.test("getUrlFromStringOrRequest - extracts URL from Request object", () => {
  const request = new Request("https://example.com/api");
  const result = getUrlFromStringOrRequest(request);
  assertEquals(result, "https://example.com/api");
});

Deno.test("combineURL - combines base URL and path", () => {
  const result = combineURL("https://example.com", "/api/users");
  assertEquals(result.toString(), "https://example.com/api/users");
});

Deno.test("combineURL - handles base URL without trailing slash", () => {
  const result = combineURL("https://example.com", "api/users");
  assertEquals(result.toString(), "https://example.com/api/users");
});

Deno.test("combineURL - handles base URL with trailing slash", () => {
  const result = combineURL("https://example.com/", "/api/users");
  assertEquals(result.toString(), "https://example.com/api/users");
});

Deno.test("combineURL - adds query parameters", () => {
  const result = combineURL("https://example.com", "/api/users", {
    page: 1,
    limit: 10,
  });
  assertEquals(
    result.toString(),
    "https://example.com/api/users?page=1&limit=10",
  );
});

Deno.test("combineURL - removes trailing slash from result", () => {
  const result = combineURL("https://example.com", "/api/");
  assertEquals(result.toString(), "https://example.com/api");
});

Deno.test("combineURL - works with URL objects", () => {
  const baseURL = new URL("https://example.com");
  const result = combineURL(baseURL, "/api/users");
  assertEquals(result.toString(), "https://example.com/api/users");
});
