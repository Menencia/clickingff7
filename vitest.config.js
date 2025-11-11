import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // ✅ rend describe, it, expect, etc. disponibles globalement
    environment: "jsdom", // si tu testes du code frontend
  },
});
