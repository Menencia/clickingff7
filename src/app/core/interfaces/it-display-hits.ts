import { Action } from 'src/app/models/action';

export interface ItDisplayHits {
  id: string;
  hits: number;
  context: Action;
}
