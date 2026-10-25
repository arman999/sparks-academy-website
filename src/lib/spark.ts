/**
 * Geometry for the Sparks motif: a "flying spark" is a teardrop whose round
 * head flies away from a point of origin and whose tail tapers back toward it.
 *
 * streakPath(originX, originY, angleDeg, gap, length, headRadius)
 *   angleDeg: 0 = pointing right, 90 = pointing straight up.
 */
export function streakPath(ox: number, oy: number, angleDeg: number, gap: number, length: number, r: number): string {
  const a = (-angleDeg * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  const p = (x: number, y: number) => `${(ox + x * cos - y * sin).toFixed(2)} ${(oy + x * sin + y * cos).toFixed(2)}`;
  const head = gap + length;
  return `M ${p(gap, 0)} L ${p(head, -r)} A ${r} ${r} 0 1 1 ${p(head, r)} Z`;
}

/** The three sparks of the Sparks Academy mark, in a 64×64 box. */
export const markStreaks = [
  { d: streakPath(14, 50, 82, 6, 30, 5.2), delay: "0.15s" },
  { d: streakPath(14, 50, 45, 6, 36, 6), delay: "0s" },
  { d: streakPath(14, 50, 10, 6, 30, 5.2), delay: "0.3s" },
];
export const markDot = { cx: 14, cy: 50, r: 5 };
