import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: ["./sdk/index.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    exports: true,
    sourcemap: true,
  },
]);
