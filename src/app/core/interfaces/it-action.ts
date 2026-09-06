import { Context } from '../../models/context';

export interface ItAction {
  use: (context: Context) => void;
}
