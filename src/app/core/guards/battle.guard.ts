import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';

import { BattleService } from '../services/battle.service';

/** Blocks navigation while a battle is ongoing. */
export const battleGuard: CanActivateFn = () => !inject(BattleService).battle();
