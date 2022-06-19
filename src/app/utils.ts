export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Return true if version 1 is older than version 2
 */
export function compareVersions(version1: string, version2: string): boolean {
  const regex = /([0-9]+).([0-9]+).([0-9]+).*/
  const match1 = version1.match(regex)
  const match2 = version2.match(regex)
  enum Change {
    Major = 1,
    Minor = 2,
    Fix = 3
  }

  if (!match1 || !match2) {
    return false
  }

  if (match1[Change.Major] < match2[Change.Major]) {
    return false
  }
  if (match1[Change.Major] > match2[Change.Major]) {
    return true
  }

  if (match1[Change.Minor] < match2[Change.Minor]) {
    return false
  }
  if (match1[Change.Minor] > match2[Change.Minor]) {
    return true
  }

  if (match1[Change.Fix] < match2[Change.Fix]) {
    return false
  }
  if (match1[Change.Fix] > match2[Change.Fix]) {
    return true
  }

  return true
}
