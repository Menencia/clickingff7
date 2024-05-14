import { CharacterRef } from './refs/characters';
import { ItemRef } from './refs/items';
import { MateriaRef } from './refs/materias';
import { WeaponRef } from './refs/weapons';
import { ZoneRef } from './refs/zones';

export interface CharactersSave {
  list: CharacterSave[];
}

export interface TeamSave {
  list: CharacterSave[];
  hp: number;
  mp: number;
  limit: number;
}

export interface CharacterSave {
  ref: CharacterRef;
  level: number;
  xp: number;
  image: string;
  weaponRef: WeaponRef;
}

export interface ZonesSave {
  list: ZoneSave[];
  level: number;
  levelMax: number;
}

export interface ZoneSave {
  ref: ZoneRef;
  nbFights: number;
  completed: boolean;
}

export interface WeaponSave {
  ref: WeaponRef;
  nbr: number;
  equipped: boolean;
}

export interface MateriaSave {
  ref: MateriaRef;
  ap: number;
  level: number;
  equipped: boolean;
}

export interface ItemSave {
  ref: ItemRef;
  nbr: number;
  equipped: boolean;
}

export interface Save {
  characters: CharactersSave;
  team: TeamSave;
  zones: ZonesSave;
  weapons: WeaponSave[];
  materias: MateriaSave[];
  items: ItemSave[];
  language: string;
  difficulty: number;
  time: number;
  gils: number;
  version: string;
}
