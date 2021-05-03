import { GameService } from '../game.service';
import { Item } from './item';
import { ItemLoader, ItemRef } from './loaders/item-loader';
import { MateriaLoader, MateriaRef } from './loaders/materia-loader';
import { WeaponLoader, WeaponRef } from './loaders/weapon-loader';
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

    const weapons = [
      WeaponRef.BusterSword,
      WeaponRef.GatlingGun,
      WeaponRef.AssaultGun,
      WeaponRef.LeatherGlove,
      WeaponRef.MetalKnuckle,
      WeaponRef.GuardStick,
      WeaponRef.MythrilRod,
      // 'MythrilSaber',
      // 'CannonBall',
      // 'MythrilClaw',
      // 'FullMetalStaff',
      // 'FPtShuriken'
    ];
    for (const w of weapons) {
      const weapon = WeaponLoader.build(w, this.game);
      if (weapon.zoneAvailable <= this.game.zones.levelMax && (this.allWeapons || weapon.inStock() === 0)) {
        this.weapons.push(weapon);
      }
    }

    const materias = [
      MateriaRef.Restore,
      MateriaRef.Bolt,
      MateriaRef.Ice,
      MateriaRef.Fire,
      MateriaRef.Poison,
      // 'Earth',
      // 'ChocoMog'
    ];
    for (const m of materias) {
      const materia = MateriaLoader.build(m, this.game);
      if (materia.zoneAvailable <= this.game.zones.levelMax) {
        this.materias.push(materia);
      }
    }

    const items = [
      ItemRef.Potion,
      ItemRef.Ether,
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
  enableAllWeapons(): void {
    this.allWeapons = true;
    this.refresh();
  }

  /**
   * Disable a shop option
   */
  disableAllWeapons(): void {
    this.allWeapons = false;
    this.refresh();
  }

}
