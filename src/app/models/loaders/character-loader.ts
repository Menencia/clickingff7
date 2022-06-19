import { Character } from '../character'
import { Aerith } from '../characters/aerith'
import { Barret } from '../characters/barret'
import { Cloud } from '../characters/cloud'
import { RedXIII } from '../characters/red-xiii'
import { Tifa } from '../characters/tifa'
import { Yuffie } from '../characters/yuffie'
import { CharacterRef } from '../refs/characters'

export class CharacterLoader {

  /**
   *
   */
  static build(ref: CharacterRef): Character {
    let character
    switch (ref) {
      case CharacterRef.Aerith:
        character = new Aerith()
        break
      case CharacterRef.Barret:
        character = new Barret()
        break
      case CharacterRef.Cloud:
        character = new Cloud()
        break
      case CharacterRef.RedXIII:
        character = new RedXIII()
        break
      case CharacterRef.Tifa:
        character = new Tifa()
        break
      case CharacterRef.Yuffie:
        character = new Yuffie()
        break
      default:
        throw new Error('Character not found')
    }
    return character
  }

}
