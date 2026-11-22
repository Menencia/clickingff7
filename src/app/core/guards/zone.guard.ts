import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';

import { GameService } from '../services/game.service';

/** Allows access once the PHS screen is unlocked. */
export const zoneGuard: CanActivateFn = () =>
  inject(GameService).zones.isPhsUnlocked();
