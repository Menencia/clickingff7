import { Character } from 'src/app/models/character';
import { Items } from 'src/app/models/items';
import { Materias } from 'src/app/models/materias';
import { CharacterRef } from 'src/app/models/refs/characters';
import { WeaponRef } from 'src/app/models/refs/weapons';
import { ZoneRef } from 'src/app/models/refs/zones';
import { Characters } from 'src/app/models/units/characters';
import { Weapon } from 'src/app/models/weapon';
import { Weapons } from 'src/app/models/weapons';
import { Zone } from 'src/app/models/zone';
import { Zones } from 'src/app/models/zones';

const zones = new Zones();
zones.add(
  new Zone({ ref: ZoneRef.Zone1, image: '', level: 1, enemies: [], boss: [] }),
);

const weapon = new Weapon({
  ref: WeaponRef.BusterSword,
  hits: 19,
  maxMaterias: 1,
  type: 'broadsword',
  price: 100,
  zoneAvailable: 1,
});

const character = new Character({
  ref: CharacterRef.Cloud,
  image: '',
  hp: 100,
  mp: 10,
  weapon,
  weaponType: 'broadsword',
  xp: 0,
});

const characters = new Characters();
characters.add(character, true);

const weapons = new Weapons();
weapons.add(weapon, true);

const materias = new Materias();

const items = new Items();

export const weaponMock = weapon;

export const characterMock = character;

export const ZonesMock = { zones };

export const CharactersMock = { characters };

export const WeaponsMock = { weapons };

export const MateriasMock = { materias };

export const ItemsMock = { items };
