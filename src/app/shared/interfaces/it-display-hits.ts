import { Action } from '@shared/models/action';

export interface ItDisplayHits {
  id: string;
  hits: number;
  context: Action;
}
