import { Character } from '../../models/character';
import { Items } from '../../models/items';
import { HpPotion } from '../../models/items/hp-potion';
import { Materias } from '../../models/materias';
import { AttackMateria } from '../../models/materias/attack-materia';
import { CharacterRef } from '../../models/refs/characters';
import { ItemRef } from '../../models/refs/items';
import { MateriaRef } from '../../models/refs/materias';
import { WeaponRef } from '../../models/refs/weapons';
import { ZoneRef } from '../../models/refs/zones';
import { Characters } from '../../models/units/characters';
import { Weapon } from '../../models/weapon';
import { Weapons } from '../../models/weapons';
import { Zone } from '../../models/zone';
import { Zones } from '../../models/zones';

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

const materia = new AttackMateria({
  ref: MateriaRef.Bolt,
  type: 'attack',
  color: 'green',
  ap: 4,
  price: 300,
  pwr: 50,
  elements: ['bolt'],
  zoneAvailable: 1,
});

const materias = new Materias();
materias.add(materia);

const item = new HpPotion({
  ref: ItemRef.Potion,
  price: 10,
  pwr: 0.33,
  type: 'hp-potion',
  zoneAvailable: 1,
});

const items = new Items();
items.add(item);

export const weaponMock = weapon;

export const characterMock = character;

export const itemMock = item;

export const materiaMock = materia;

export const ZonesMock = { zones };

export const CharactersMock = { characters };

export const WeaponsMock = { weapons };

export const MateriasMock = { materias };

export const ItemsMock = { items };
