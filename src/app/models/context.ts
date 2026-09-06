import { Battle } from './battle';
import { Characters } from './units/characters';

export interface Context {
  characters: Characters;
  battle: Battle | undefined;
}
