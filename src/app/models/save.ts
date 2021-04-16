export interface CharactersSave {
  list: CharacterSave[];
  hp: number;
  mp: number;
  limit: number;
}

export interface CharacterSave {
  ref: string;
  inTeam: boolean;
  level: number;
  xp: number;
}

export interface ZonesSave {
  list: ZoneSave[];
  level: number;
  levelMax: number;
}

export interface ZoneSave {
  ref: string;
  nbFights: number;
  completed: boolean;
}

export interface WeaponSave {
  ref: string;
  nbr: number;
  equipped: boolean;
}

export interface MateriaSave {
  ref: string;
  ap: number;
  level: number;
  equipped: boolean;
}

export interface ItemSave {
  ref: string;
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
