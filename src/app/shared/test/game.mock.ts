import { Character } from 'src/app/models/character';
import { Items } from 'src/app/models/items';
import { HpPotion } from 'src/app/models/items/hp-potion';
import { Materias } from 'src/app/models/materias';
import { AttackMateria, AttackMateriaJson } from 'src/app/models/materias/attack-materia';
import { CharacterRef } from 'src/app/models/refs/characters';
import { ItemRef } from 'src/app/models/refs/items';
import { MateriaRef } from 'src/app/models/refs/materias';
import { WeaponRef } from 'src/app/models/refs/weapons';
import { ZoneRef } from 'src/app/models/refs/zones';
import { Team } from 'src/app/models/team';
import { Characters } from 'src/app/models/units/characters';
import { Weapon } from 'src/app/models/weapon';
import { Weapons } from 'src/app/models/weapons';
import { Zone } from 'src/app/models/zone';
import { Zones } from 'src/app/models/zones';

const zones = new Zones();
zones.add(new Zone({ ref: ZoneRef.Zone1, image: '', level: 1, enemies: [], boss: [] }, [], []));

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
} as AttackMateriaJson);

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

export const CharactersMock = { team, characters };

export const WeaponsMock = { weapons };

export const MateriasMock = { materias };

export const ItemsMock = { items };
