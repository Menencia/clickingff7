import { BattleService } from "../services/battle.service";

export interface ItAction {
  use: (battleService: BattleService) => void
}
