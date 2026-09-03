import { Battle } from '../../models/battle';

export interface ItAction {
  use: (battle: Battle) => void;
}
