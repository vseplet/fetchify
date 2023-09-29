import { build, emptyDir } from "https://deno.land/x/dnt@0.38.1/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
    undici: true,
  },

  package: {
    name: "@sevapp/fetchify",
    version: Deno.args[0],
    main: "./esm/mod.js",
    description: "Gentle, promise-based HTTP client for Deno and Node.js.",
    license: "LGPL-2.1",
    repository: {
      type: "git",
      url: "git+https://github.com/sevapp/fetchify.git",
    },
    bugs: {
      url: "https://github.com/sevapp/fetchify/issues",
    },
    keywords: [
      "http",
      "fetch",
      "axios",
      "request",
      "client",
      "rate-limit",
      "ajax",
      "promise",
    ],
    author: "Vsevolod Pletnev (sevapp)",
  },

  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
