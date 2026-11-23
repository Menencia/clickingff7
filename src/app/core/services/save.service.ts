import { Injectable, inject, WritableSignal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Difficulty, isDifficulty } from '../../models/difficulty';
import { Items } from '../../models/items';
import { getLanguage } from '../../models/language';
import { Materias } from '../../models/materias';
import { Save } from '../../models/save';
import { Characters } from '../../models/units/characters';
import { Weapons } from '../../models/weapons';
import { MAX_ZONES, Zones } from '../../models/zones';
import { StoreService } from './store.service';

/**
 * The saved part of the game state, as held by GameService
 */
export interface GameState {
  readonly characters: Characters;
  readonly zones: Zones;
  readonly weapons: Weapons;
  readonly materias: Materias;
  readonly items: Items;
  readonly gils: WritableSignal<number>;
  language: string;
  difficulty: Difficulty;
  readonly time: WritableSignal<number>;
  version: string;
}

/**
 * Converts the game state to a Save and back. Storage and the game's life
 * cycle (new game, import, refresh) stay in GameService.
 */
@Injectable({
  providedIn: 'root',
})
export class SaveService {
  private translate = inject(TranslateService);
  private store = inject(StoreService);

  /**
   * Export the game
   */
  export(game: GameState): Save {
    return {
      characters: game.characters.export(),
      zones: game.zones.export(),
      weapons: game.weapons.export(game.characters.list),
      materias: game.materias.export(),
      items: game.items.export(),
      gils: game.gils(),
      language: game.language,
      difficulty: game.difficulty,
      time: game.time(),
      version: game.version,
    };
  }

  /**
   * Load a save into an emptied game state (see GameService.preload()).
   * Throws if the save references unknown data or is not playable.
   */
  load(game: GameState, save: Save): void {
    // weapons (w.equipped is ignored: characters hold the worn weapons)
    save.weapons.forEach((w) => {
      game.weapons.add(this.store.getWeapon(w.ref).load(w));
    });

    // characters
    save.characters.list.forEach((c) => {
      const character = this.store.getCharacter(c.ref).load(c);
      character.setWeapon(this.store.getWeapon(c.weaponRef));
      game.characters.add(character, c.inTeam);
    });
    game.characters.linkWeapons(game.weapons.list);

    game.characters.hp.set(save.characters.hp);
    game.characters.mp.set(save.characters.mp);
    game.characters.limit.set(save.characters.limit);

    // zones
    save.zones.list.forEach((z) => {
      const zone = this.store.getZone(z.ref).load(z);
      game.zones.add(zone);
    });

    game.zones.level = save.zones.level;
    game.zones.levelMax = save.zones.levelMax;

    game.characters.available(game.zones.levelMax);

    // materias
    save.materias.forEach((m) => {
      const materia = this.store.getMateria(m.ref).load(m);
      game.materias.add(materia, m.equipped);
    });

    // items
    save.items.forEach((i) => {
      const item = this.store.getItem(i.ref).load(i);
      game.items.add(item, i.equipped);
    });
    game.items.fit();

    // An unknown language falls back to the browser's, then to English.
    game.language = getLanguage(
      save.language,
      getLanguage(this.translate.getBrowserLang()),
    );
    // Older saves store the difficulty as a string ("2").
    game.difficulty = Number(save.difficulty);

    game.time.set(save.time);
    game.gils.set(save.gils);

    this.checkPlayable(game);
  }

  /**
   * Throws if the loaded game cannot be played: current zone or last
   * unlocked zone missing, empty team or unknown difficulty. Completes the
   * shape checks of decodeSave(), which cannot see the game data.
   */
  private checkPlayable(game: GameState): void {
    const { level, levelMax, list } = game.zones;
    const lastZone = Math.max(0, ...list.map((z) => z.level));
    if (level > levelMax || levelMax > MAX_ZONES || levelMax > lastZone) {
      throw new Error('Invalid zone progress');
    }
    game.zones.current();

    if (game.characters.getTeam().length === 0) {
      throw new Error('Empty team');
    }

    if (!isDifficulty(game.difficulty)) {
      throw new Error('Unknown difficulty');
    }
  }
}
