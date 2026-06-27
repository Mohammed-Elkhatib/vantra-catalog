/**
 * Pure geometry for the "Instrument" signature visuals. No React, no DOM, so it is
 * unit-tested directly. The components in src/components/instruments consume these.
 */

export interface Point {
  x: number;
  y: number;
}

/** Default EN 1822 grade scale shown on the classification ladder. */
export const EN1822_SCALE = ["E12", "H13", "H14", "U15", "U16"] as const;

/**
 * Sample points for the filtration efficiency-vs-particle-size curve. Efficiency is
 * highest for large and very small particles and lowest at the Most Penetrating Particle
 * Size (~0.3 micron), so the curve is a valley. In SVG coords (y grows downward) the
 * valley is the point of maximum y, near the middle.
 */
export function efficiencyCurvePoints(opts: { width: number; height: number; samples?: number }): Point[] {
  const { width, height } = opts;
  const samples = Math.max(2, opts.samples ?? 24);
  const top = height * 0.15; // high-efficiency baseline (near the top)
  const depth = height * 0.6; // how deep the MPPS valley dips
  const points: Point[] = [];
  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1); // 0..1 across the x axis
    const x = t * width;
    const y = top + depth * (1 - Math.pow(2 * t - 1, 2)); // valley at t = 0.5
    points.push({ x, y });
  }
  return points;
}

/** Index of a grade within the scale (for placing the needle), or -1 if absent. */
export function gradeLadderIndex(grade: string, scale: readonly string[] = EN1822_SCALE): number {
  return scale.indexOf(grade);
}

/** Map a value within [min,max] to a gauge needle angle in degrees, -90 (min)..+90 (max), clamped. */
export function gaugeAngle(value: number, min: number, max: number): number {
  if (max === min) return 0;
  const clamped = Math.min(max, Math.max(min, value));
  const t = (clamped - min) / (max - min);
  return -90 + t * 180;
}

/**
 * Normalized bar heights for octave-band insertion loss, ordered by ascending frequency.
 * The loudest band maps to `maxPx`.
 */
export function octaveBandHeights(loss: Record<string, number>, maxPx: number): { hz: string; px: number }[] {
  const freq = (k: string) => parseInt(k, 10);
  const entries = Object.entries(loss).sort((a, b) => freq(a[0]) - freq(b[0]));
  const maxVal = Math.max(1, ...entries.map(([, v]) => v));
  return entries.map(([hz, v]) => ({ hz, px: (v / maxVal) * maxPx }));
}
