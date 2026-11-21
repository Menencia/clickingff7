import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';

import { PHS_UNLOCK_ZONE } from '../../shared/utils/game.utils';
import { GameService } from '../services/game.service';

/** Allows access once the PHS unlock zone has been reached. */
export const zoneGuard: CanActivateFn = () =>
  inject(GameService).zones.levelMax >= PHS_UNLOCK_ZONE;
