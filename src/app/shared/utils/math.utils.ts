export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function uuid(prefix = ''): string {
  return prefix + (Math.random() + 1).toString(36).substring(7);
}

export function addPercent(value: number, percent: number): number {
  return Math.floor(value * (1 + percent / 100));
}
