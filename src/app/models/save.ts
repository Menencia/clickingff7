import { CharacterRef } from './loaders/character-loader';
import { ItemRef } from './loaders/item-loader';
import { MateriaRef } from './loaders/materia-loader';
import { WeaponRef } from './loaders/weapon-loader';
import { ZoneRef } from './loaders/zone-loader';

export interface CharactersSave {
  list: CharacterSave[];
  hp: number;
  mp: number;
  limit: number;
}

export interface CharacterSave {
  ref: CharacterRef;
  inTeam: boolean;
  level: number;
  xp: number;
  image: string;
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
