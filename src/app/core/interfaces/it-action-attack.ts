import { ElementType } from '../../models/element-type';
import { ItAction } from './it-action';

export interface ItActionAttack extends ItAction {
  elements: ElementType[];
}
