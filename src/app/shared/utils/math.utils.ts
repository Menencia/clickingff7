export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function addPercent(value: number, percent: number): number {
  return Math.floor(value * (1 + percent / 100));
}
