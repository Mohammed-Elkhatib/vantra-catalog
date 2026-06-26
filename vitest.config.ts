import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "data/**/*.test.ts"],
  },
  resolve: {
    // fileURLToPath gives a correct Windows path (avoids the leading-slash `/C:/...` bug)
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
