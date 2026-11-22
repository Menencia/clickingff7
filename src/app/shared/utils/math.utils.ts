export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/** Returns value / max as a rounded percentage, or 0 when max is 0 */
export function percent(value: number, max: number): number {
  return max > 0 ? Math.round((value / max) * 100) : 0;
}
