/**
 * An owned entry that stacks by ref: {nbr} copies of the same thing
 */
export interface Stackable {
  ref: string;
  nbr: number;
}

/**
 * A collection whose entries stack by ref (weapons, items)
 */
export class Stock<T extends Stackable> {
  list: T[] = [];

  /**
   * Adds one copy: stacks on the owned entry with the same ref, or adds
   * {entry} to the list. Returns the entry that holds the copy.
   */
  add(entry: T): T {
    const owned = this.list.find((e) => e.ref === entry.ref);
    if (owned) {
      owned.nbr += 1;
      return owned;
    }
    this.list.push(entry);
    return entry;
  }

  /**
   * Removes one copy of the owned {entry}: decrements its count, or drops it
   * from the list (as a new array) when it was the last copy
   */
  remove(entry: T): void {
    if (entry.nbr > 1) {
      entry.nbr -= 1;
    } else {
      this.list = this.list.filter((e) => e !== entry);
    }
  }

  /**
   * Returns the number of owned copies with the same ref as {entry}
   */
  inStock(entry: Stackable): number {
    return this.list
      .filter((e) => e.ref === entry.ref)
      .reduce((sum, e) => sum + e.nbr, 0);
  }
}
