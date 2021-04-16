import { GameService } from '../game.service';
import { Item } from './item';
import { ItemLoader, ItemRef } from './loaders/item-loader';
import { Materia } from './materia';
import { Weapon } from './weapon';

export class Shop {

  game: GameService;
  section: string;
  type: string;
  allWeapons: boolean;

  weapons: Weapon[];
  materias: Materia[];
  items: Item[];

  /**
   * Init
   */
  constructor(game: GameService) {
    this.game = game;

    this.section = 'buy';
    this.type = 'weapons';
    this.allWeapons = false;

    this.weapons = [];
    this.materias = [];
    this.items = [];
  }

  refresh(): void {
    this.weapons = [];
    this.materias = [];
    this.items = [];

    // const weapons = [
    //   'BusterSword',
    //   'GatlingGun',
    //   'AssaultGun',
    //   'LeatherGlove',
    //   'MetalKnuckle',
    //   'GuardStick',
    //   'MythrilRod',
    //   'MythrilSaber',
    //   'CannonBall',
    //   'MythrilClaw',
    //   'FullMetalStaff',
    //   'FPtShuriken'
    // ];
    // for (const w of weapons) {
    //   const weapon = Weapon.buildByRef(w, this.game);
    //   if (weapon.zoneAvailable <= this.game.zones.levelMax && (this.allWeapons || weapon.inStock() === 0)) {
    //     this.weapons.push(weapon);
    //   }
    // }

    // const materias = [
    //   'Restore',
    //   'Bolt',
    //   'Ice',
    //   'Fire',
    //   'Poison',
    //   'Earth',
    //   'ChocoMog'
    // ];
    // for (const m of materias) {
    //   const materia = Materia.buildByRef(m, this.game);
    //   if (materia.zoneAvailable <= this.game.zones.levelMax) {
    //     this.materias.push(materia);
    //   }
    // }

    const items = [
      ItemRef.Potion,
      // 'Ether',
      // 'HiPotion',
      // 'HiEther'
    ];
    for (const i of items) {
      const item = ItemLoader.build(i, this.game);
      if (item.available(this.game.zones.levelMax)) {
        this.items.push(item);
      }
    }
  }

  /**
   * Enable a shop option
   */
  // enable(option: string) {
  //   this[option] = true;
  //   this.refresh();
  // }

  /**
   * Disable a shop option
   */
  // disable(option: string) {
  //   this[option] = false;
  //   this.refresh();
  // }

}
