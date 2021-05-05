import { GameService } from 'src/app/game.service';
import { Character } from '../character';
import { Aerith } from '../characters/aerith';
import { Barret } from '../characters/barret';
import { Cloud } from '../characters/cloud';
import { RedXIII } from '../characters/red-xiii';
import { Tifa } from '../characters/tifa';
import { Yuffie } from '../characters/yuffie';

export enum CharacterRef {
  Aerith = 'Aerith',
  Barret = 'Barret',
  Cloud = 'Cloud',
  RedXIII = 'RedXIII',
  Tifa = 'Tifa',
  Yuffie = 'Yuffie',
}

export class CharacterLoader {

  /**
   *
   */
  static build(ref: CharacterRef, game: GameService): Character {
    let character;
    switch (ref) {
      case CharacterRef.Aerith:
        character = new Aerith(game);
        break;
      case CharacterRef.Barret:
        character = new Barret(game);
        break;
      case CharacterRef.Cloud:
        character = new Cloud(game);
        break;
      case CharacterRef.RedXIII:
        character = new RedXIII(game);
        break;
      case CharacterRef.Tifa:
        character = new Tifa(game);
        break;
      case CharacterRef.Yuffie:
        character = new Yuffie(game);
        break;
      default:
        throw new Error('Character not found');
    }
    return character;
  }

}
