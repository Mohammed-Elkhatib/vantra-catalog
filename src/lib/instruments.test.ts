import { test, expect } from "vitest";
import { efficiencyCurvePoints, gradeLadderIndex, gaugeAngle, octaveBandHeights } from "./instruments";

test("efficiency curve is a valley: the middle dips lower (higher y) than the ends", () => {
  const pts = efficiencyCurvePoints({ width: 100, height: 60, samples: 11 });
  expect(pts).toHaveLength(11);
  const mid = pts[Math.floor(pts.length / 2)];
  expect(mid.y).toBeGreaterThan(pts[0].y);
  expect(mid.y).toBeGreaterThan(pts[pts.length - 1].y);
  expect(pts[0].x).toBe(0);
  expect(pts[pts.length - 1].x).toBe(100);
});

test("gradeLadderIndex finds the grade position or -1", () => {
  expect(gradeLadderIndex("E12")).toBe(0);
  expect(gradeLadderIndex("H14")).toBe(2);
  expect(gradeLadderIndex("U16")).toBe(4);
  expect(gradeLadderIndex("H10")).toBe(-1);
});

test("gaugeAngle maps min/mid/max to -90/0/90 and clamps", () => {
  expect(gaugeAngle(0, 0, 10)).toBe(-90);
  expect(gaugeAngle(5, 0, 10)).toBe(0);
  expect(gaugeAngle(10, 0, 10)).toBe(90);
  expect(gaugeAngle(99, 0, 10)).toBe(90); // clamped
  expect(gaugeAngle(-99, 0, 10)).toBe(-90); // clamped
});

test("octaveBandHeights orders by frequency and scales the loudest band to maxPx", () => {
  const bars = octaveBandHeights({ "500hz": 34, "63hz": 6, "1000hz": 41 }, 100);
  expect(bars.map((b) => b.hz)).toEqual(["63hz", "500hz", "1000hz"]);
  const loudest = bars.find((b) => b.hz === "1000hz")!;
  expect(loudest.px).toBe(100);
});
