import { random } from '../utils'

export class Attack {

  pwr: number
  type: string[]

  /**
   * Init
   */
   constructor(pwr: number, type: null|string[] = null) {
    this.pwr = pwr
    this.type = type ? type : []
  }

  /**
   * Get *random* hits from power
   */
  getHits(): number {
    // base hits
    const a = this.pwr * (1 - 10 / 100)
    const b = this.pwr * (1 + 10 / 100)
    let hits = Math.round(random(a, b))

    // critical hits (10%)
    const r = random(0, 100)
    if (r <= 10) {
        hits *= 2
    }

    return hits
  }

}
