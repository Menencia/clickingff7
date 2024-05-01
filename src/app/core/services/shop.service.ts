import { Injectable } from '@angular/core';
import { Item } from 'src/app/models/item';
import { Materia } from 'src/app/models/materia';
import { ItemRef } from 'src/app/models/refs/items';
import { MateriaRef } from 'src/app/models/refs/materias';
import { WeaponRef } from 'src/app/models/refs/weapons';
import { Weapon } from 'src/app/models/weapon';

import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  weapons: Weapon[] = [];

  materias: Materia[] = [];

  items: Item[] = [];

  constructor(private store: StoreService) {}

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
    weapons.forEach((w) => {
      const weapon = this.store.getWeapon(w);
      if (weapon.zoneAvailable <= levelMax) {
        this.weapons.push(weapon);
      }
    });

    const materias = [
      MateriaRef.Restore,
      MateriaRef.Bolt,
      MateriaRef.Ice,
      MateriaRef.Fire,
      MateriaRef.Poison,
      MateriaRef.Earth,
      MateriaRef.ChocoMog,
    ];
    materias.forEach((m) => {
      const materia = this.store.getMateria(m);
      if (materia.zoneAvailable <= levelMax) {
        this.materias.push(materia);
      }
    });

    const items = [
      ItemRef.Potion,
      ItemRef.Ether,
      ItemRef.HiPotion,
      ItemRef.HiEther,
    ];
    items.forEach((i) => {
      const item = this.store.getItem(i);
      if (item.available(levelMax)) {
        this.items.push(item);
      }
    });
  }
}
