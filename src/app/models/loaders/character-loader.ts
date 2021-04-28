import { GameService } from 'src/app/game.service';
import { Character } from '../character';
import { Barret } from '../characters/barret';
import { Cloud } from '../characters/cloud';
import { Tifa } from '../characters/tifa';

export enum CharacterRef {
  Cloud = 'Cloud',
  Barret = 'Barret',
  Tifa = 'Tifa'
}

export class CharacterLoader {

  /**
   *
   */
  static build(ref: CharacterRef, game: GameService): Character {
    let character;
    switch (ref) {
      case CharacterRef.Cloud:
        character = new Cloud(game);
        break;
      case CharacterRef.Barret:
        character = new Barret(game);
        break;
      case CharacterRef.Tifa:
        character = new Tifa(game);
        break;
      default:
        throw new Error('Character not found');
    }
    return character;
  }

}
