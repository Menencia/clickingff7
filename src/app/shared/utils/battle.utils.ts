import { random } from './math.utils';

/** Calculate raw damages */
export function calculateHits(baseHits: number, pwr: number): number {
  // base hits with variance (-+10%)
  const a = baseHits * (pwr / 100) * (1 - 10 / 100);
  const b = baseHits * (pwr / 100) * (1 + 10 / 100);
  let hits = Math.round(random(a, b));

  // critical hits (<10%)
  if (random(0, 100) <= 10) {
    hits *= 2;
  }

  return hits;
}
