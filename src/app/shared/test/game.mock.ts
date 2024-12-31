import { Character } from '@shared/models/character';
import { Item } from '@shared/models/item';
import { Items } from '@shared/models/items';
import { Materia } from '@shared/models/materia';
import { Materias } from '@shared/models/materias';
import { CharacterRef } from '@shared/models/refs/characters';
import { ItemRef } from '@shared/models/refs/items';
import { MateriaRef } from '@shared/models/refs/materias';
import { WeaponRef } from '@shared/models/refs/weapons';
import { ZoneRef } from '@shared/models/refs/zones';
import { Team } from '@shared/models/team';
import { Characters } from '@shared/models/units/characters';
import { Weapon } from '@shared/models/weapon';
import { Weapons } from '@shared/models/weapons';
import { Zone } from '@shared/models/zone';
import { Zones } from '@shared/models/zones';

const zones = new Zones();
zones.add(new Zone({ ref: ZoneRef.Zone1, image: '', level: 1, enemies: [], boss: [] }, 0));

const weapon = new Weapon({
  ref: WeaponRef.BusterSword,
  hits: 19,
  maxMaterias: 1,
  type: 'broadsword',
  price: 100,
  zoneAvailable: 1,
});

const character = new Character(
  {
    ref: CharacterRef.Cloud,
    image: '',
    weapon: WeaponRef.BusterSword,
    weaponType: 'broadsword',
    stats: {},
  },
  weapon,
);

const characters = new Characters();
characters.add(character);

const team = new Team();
team.join(character);

const weapons = new Weapons();
weapons.add(weapon);

const materia = new Materia({
  ref: MateriaRef.Bolt,
  type: 'attack',
  color: 'green',
  ap: 4,
  price: 300,
  effect: 'damages magic bold 70',
  mp: 2,
  useOutsideBattle: false,
  zoneAvailable: 1,
});

const materias = new Materias();
materias.add(materia);

const item = new Item({
  ref: ItemRef.Potion,
  effect: 'heal 33',
  price: 10,
  zoneAvailable: 1,
});

const items = new Items();
items.add(item);

export const weaponMock = weapon;

export const characterMock = character;

export const itemMock = item;

export const materiaMock = materia;

export const ZonesMock = { zones };

export const CharactersMock = { team, characters };

export const WeaponsMock = { weapons };

export const MateriasMock = { materias };

export const ItemsMock = { items };
