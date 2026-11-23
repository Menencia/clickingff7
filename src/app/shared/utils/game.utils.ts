/** Level cap for characters and materias */
export const MAX_LEVEL = 100;

/** Highest zone reached that unlocks the PHS screen */
export const PHS_UNLOCK_ZONE = 5;

/** Random variance applied to damages and cures (±10%) */
export const VARIANCE = 10 / 100;

/**
 * Multiplier for a base stat rated from 1 to 5: 3 is neutral (×1),
 * each point above or below adds or removes 10%.
 */
export function statFactor(stat: number): number {
  return ((stat - 3) * 10) / 100 + 1;
}

/**
 * Same as statFactor, but a high stat lowers the multiplier
 * (used for XP needed to level up).
 */
export function inverseStatFactor(stat: number): number {
  return statFactor(6 - stat);
}

/**
 * Returns a random integer within ±VARIANCE of the given value.
 * The fractional part is rounded up with a probability equal to it,
 * so small values still vary while the average stays the value.
 * A positive value never drops to 0.
 */
export function withVariance(value: number): number {
  if (value <= 0) {
    return 0;
  }
  const varied = value * (1 + VARIANCE * (2 * Math.random() - 1));
  return Math.max(1, Math.floor(varied + Math.random()));
}
