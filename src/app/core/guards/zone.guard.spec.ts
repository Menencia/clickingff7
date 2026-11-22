import { TestBed } from '@angular/core/testing';
import type {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Zones } from '../../models/zones';
import { PHS_UNLOCK_ZONE } from '../../shared/utils/game.utils';
import { GameService } from '../services/game.service';
import { zoneGuard } from './zone.guard';

describe('zoneGuard', () => {
  let zones: Zones;

  const run = () =>
    TestBed.runInInjectionContext(() =>
      zoneGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  beforeEach(() => {
    zones = new Zones();
    TestBed.configureTestingModule({
      providers: [{ provide: GameService, useValue: { zones } }],
    });
  });

  it('blocks access before the PHS unlock zone', () => {
    zones.levelMax = PHS_UNLOCK_ZONE - 1;
    expect(run()).toBe(false);
  });

  it('allows access from the PHS unlock zone', () => {
    zones.levelMax = PHS_UNLOCK_ZONE;
    expect(run()).toBe(true);
    zones.levelMax = PHS_UNLOCK_ZONE + 1;
    expect(run()).toBe(true);
  });
});
