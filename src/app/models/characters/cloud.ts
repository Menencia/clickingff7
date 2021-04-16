import { GameService } from 'src/app/game.service';
import { Character } from '../character';

export class Cloud extends Character {

  name = 'Cloud Strife';
  image = '/assets/images/characters/cloud.jpg';
  weaponType = 'broadsword';
  hpBase = 3;
  mpBase = 3;
  xpBase = 3;
  notA = [];

  /**
   * Init
   */
  constructor(game: GameService) {
    super(game);
  }

}
