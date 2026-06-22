import { describe, it, expect } from "vitest";
import { readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { MATHLIVE_FONTS_DIR } from "./mathlive-config";

const here = dirname(fileURLToPath(import.meta.url));
const fontsDir = resolve(here, "../../public/mathlive/fonts");

describe("MathLive フォント配信（C20260622-002）", () => {
  it("fontsDirectory はアプリ配信パス /mathlive/fonts（/assets/fonts 推定を上書き）", () => {
    expect(MATHLIVE_FONTS_DIR).toBe("/mathlive/fonts");
  });

  it("配信パスに同梱フォント（KaTeX woff2）が実在する = 404 にならない", () => {
    expect(existsSync(fontsDir)).toBe(true);
    const woff2 = readdirSync(fontsDir).filter((f) => f.endsWith(".woff2"));
    expect(woff2.length).toBeGreaterThan(0);
    // 代表的なメインフォントが含まれること
    expect(woff2.some((f) => f.includes("KaTeX_Main"))).toBe(true);
    expect(woff2.some((f) => f.includes("KaTeX_Math"))).toBe(true);
  });
});
