import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import type { Battle } from '../../models/battle';
import { BattleService } from '../services/battle.service';
import { battleGuard } from './battle.guard';

describe('battleGuard', () => {
  const battle = signal<Battle | undefined>(undefined);

  const run = () =>
    TestBed.runInInjectionContext(() =>
      battleGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  beforeEach(() => {
    battle.set(undefined);
    TestBed.configureTestingModule({
      providers: [{ provide: BattleService, useValue: { battle } }],
    });
  });

  it('allows navigation when no battle is ongoing', () => {
    expect(run()).toBe(true);
  });

  it('blocks navigation during a battle', () => {
    battle.set({} as Battle);
    expect(run()).toBe(false);
  });
});
