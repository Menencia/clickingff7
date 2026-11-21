const VERSION_REGEX = /^(\d+)\.(\d+)\.(\d+)/;

function parseVersion(version: string): [number, number, number] | null {
  const match = version.match(VERSION_REGEX);
  if (!match) {
    return null;
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/**
 * Return true if `version` is greater than or equal to `min`.
 * Only the major.minor.patch numbers are compared, numerically; any suffix
 * (e.g. `-beta`) is ignored. Returns false if either version is not parsable.
 */
export function isVersionAtLeast(version: string, min: string): boolean {
  const v = parseVersion(version);
  const m = parseVersion(min);
  if (!v || !m) {
    return false;
  }
  for (let i = 0; i < 3; i++) {
    if (v[i] !== m[i]) {
      return v[i] > m[i];
    }
  }
  return true;
}
