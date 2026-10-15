import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(import.meta.dirname, "src"),
      },
      // Load ONE copy of graphql (CommonJS) everywhere.
      // Without this, tests mix index.mjs and index.js
      // and fail with "from another module or realm".
      { find: /^graphql$/, replacement: "graphql/index.js" },
    ],
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
