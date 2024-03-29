import { Injectable } from '@angular/core';
import { Item } from 'src/app/models/item';
import { ItemLoader } from 'src/app/models/loaders/item-loader';
import { MateriaLoader } from 'src/app/models/loaders/materia-loader';
import { WeaponLoader } from 'src/app/models/loaders/weapon-loader';
import { Materia } from 'src/app/models/materia';
import { ItemRef } from 'src/app/models/refs/items';
import { MateriaRef } from 'src/app/models/refs/materias';
import { WeaponRef } from 'src/app/models/refs/weapons';
import { Weapon } from 'src/app/models/weapon';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  weapons: Weapon[] = [];
  materias: Materia[] = [];
  items: Item[] = [];

  constructor() { }

  refresh(levelMax: number): void {
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
      WeaponRef.MythrilSaber,
      WeaponRef.CannonBall,
      WeaponRef.MythrilClaw,
      WeaponRef.FullMetalStaff,
      // 'FPtShuriken'
    ];
    for (const w of weapons) {
      const weapon = WeaponLoader.build(w);
      if (weapon.zoneAvailable <= levelMax) {
        this.weapons.push(weapon);
      }
    }

    const materias = [
      MateriaRef.Restore,
      MateriaRef.Bolt,
      MateriaRef.Ice,
      MateriaRef.Fire,
      MateriaRef.Poison,
      MateriaRef.Earth,
      MateriaRef.ChocoMog,
    ];
    for (const m of materias) {
      const materia = MateriaLoader.build(m);
      if (materia.zoneAvailable <= levelMax) {
        this.materias.push(materia);
      }
    }

    const items = [
      ItemRef.Potion,
      ItemRef.Ether,
      ItemRef.HiPotion,
      ItemRef.HiEther,
    ];
    for (const i of items) {
      const item = ItemLoader.build(i);
      if (item.available(levelMax)) {
        this.items.push(item);
      }
    }
  }

}
