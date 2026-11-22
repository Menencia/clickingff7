import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { StoreService } from '../../core/services/store.service';
import { CharacterRef } from '../../models/refs/characters';
import { MateriaRef } from '../../models/refs/materias';
import { MAX_TEAM } from '../../models/units/characters';
import {
  MemoryStorage,
  provideInMemoryGameData,
  startGame,
} from '../../testing/game-data.testing';
import { ViewPhsComponent } from './view-phs.component';

describe('ViewPhsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPhsComponent],
      providers: [
        provideTranslateService({ fallbackLang: 'en' }),
        {
          provide: GameService,
          useValue: {
            run: () => {},
            characters: {
              team: signal([]),
              backup: signal([]),
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewPhsComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

describe('ViewPhsComponent (real data)', () => {
  let game: GameService;
  let phs: ViewPhsComponent;

  const character = (ref: CharacterRef) => {
    const found = game.characters.list.find((c) => c.ref === ref);
    if (!found) throw new Error(`${ref} not found`);
    return found;
  };

  beforeEach(async () => {
    vi.stubGlobal('localStorage', new MemoryStorage());
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      imports: [ViewPhsComponent],
      providers: [
        provideInMemoryGameData(),
        provideTranslateService({ fallbackLang: 'en' }),
      ],
    });
    game = await startGame();
    // zone 2: Cloud, Barret and Tifa in the team
    game.zones.level = 2;
    game.zones.levelMax = 2;
    game.buildLevel(2);
    phs = TestBed.createComponent(ViewPhsComponent).componentInstance;
  });

  afterEach(() => {
    clearTimeout(game.timer);
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('cannot join a full team', () => {
    expect(phs.team()).toHaveLength(MAX_TEAM);
    expect(phs.backup()).toEqual([]);
    expect(phs.canJoinTeam()).toBe(false);
  });

  it('a character leaves the team, then joins it again', () => {
    const tifa = character(CharacterRef.Tifa);

    phs.leaveTeam(tifa);
    expect(tifa.inTeam).toBe(false);
    expect(game.characters.team()).not.toContain(tifa);
    expect(phs.team()).not.toContain(tifa);
    expect(phs.backup()).toEqual([tifa]);
    expect(phs.canJoinTeam()).toBe(true);

    phs.joinTeam(tifa);
    expect(tifa.inTeam).toBe(true);
    expect(game.characters.team()).toContain(tifa);
    expect(phs.team()).toContain(tifa);
    expect(phs.backup()).toEqual([]);
  });

  it('keeps at least one character in the team', () => {
    expect(phs.canLeaveTeam()).toBe(true);
    phs.leaveTeam(character(CharacterRef.Tifa));
    expect(phs.canLeaveTeam()).toBe(true);
    phs.leaveTeam(character(CharacterRef.Barret));

    expect(phs.team().map((c) => c.ref)).toEqual([CharacterRef.Cloud]);
    expect(phs.canLeaveTeam()).toBe(false);
  });

  it('recomputes the team stats and clamps HP and MP', () => {
    const tifa = character(CharacterRef.Tifa);
    const hpMax = game.characters.hpMax();

    phs.leaveTeam(tifa);

    expect(game.characters.hpMax()).toBe(hpMax - tifa.getHpMax());
    expect(game.characters.hp()).toBe(game.characters.hpMax());
    expect(game.characters.mp()).toBe(game.characters.mpMax());

    phs.joinTeam(tifa);
    expect(game.characters.hpMax()).toBe(hpMax);
  });

  it('updates the team and backup on screen without leaving the PHS', () => {
    const fixture = TestBed.createComponent(ViewPhsComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const count = (col: number) =>
      el.querySelectorAll(`.col-span-2:nth-child(${col}) .phs_character`)
        .length;
    expect(count(1)).toBe(3);
    expect(count(2)).toBe(0);

    fixture.componentInstance.leaveTeam(character(CharacterRef.Tifa));
    fixture.detectChanges();
    expect(count(1)).toBe(2);
    expect(count(2)).toBe(1);

    fixture.componentInstance.joinTeam(character(CharacterRef.Tifa));
    fixture.detectChanges();
    expect(count(1)).toBe(3);
    expect(count(2)).toBe(0);
  });

  it('unequips the materias that no longer have a slot', () => {
    // Restore, Bolt + Fire: 3 slots with Cloud, Barret and Tifa
    game.materias.add(
      TestBed.inject(StoreService).getMateria(MateriaRef.Fire),
      true,
    );

    phs.leaveTeam(character(CharacterRef.Tifa));

    expect(game.characters.maxMaterias()).toBe(2);
    expect(game.materias.getEquipped().map((m) => m.ref)).toEqual([
      MateriaRef.Restore,
      MateriaRef.Bolt,
    ]);
  });
});
