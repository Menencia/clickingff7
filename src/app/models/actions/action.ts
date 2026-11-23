import { Context } from '../context';
import { ElementType } from '../element-type';

export interface ItAction {
  use: (context: Context) => void;
}

export interface ItActionAttack extends ItAction {
  elements: ElementType[];
}
