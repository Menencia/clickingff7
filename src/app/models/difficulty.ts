export enum Difficulty {
  Easy = 1,
  Normal = 2,
  Hard = 3,
}

/**
 * Difficulties offered in the Options screen, in display order.
 * The label is a translation key.
 */
export const DIFFICULTIES: readonly { value: Difficulty; label: string }[] = [
  { value: Difficulty.Easy, label: 'Easy' },
  { value: Difficulty.Normal, label: 'Normal' },
  { value: Difficulty.Hard, label: 'Hard' },
];

export function isDifficulty(value: number): value is Difficulty {
  return DIFFICULTIES.some((d) => d.value === value);
}
