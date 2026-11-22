import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { StoreService } from '../../core/services/store.service';
import { Materia } from '../../models/materia';
import { CharacterRef } from '../../models/refs/characters';
import { MateriaRef } from '../../models/refs/materias';
import {
  MemoryStorage,
  provideInMemoryGameData,
  startGame,
} from '../../testing/game-data.testing';
import { ViewMateriaComponent } from './view-materia.component';

describe('ViewMateriaComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMateriaComponent],
      providers: [
        provideTranslateService({ fallbackLang: 'en' }),
        {
          provide: GameService,
          useValue: {
            run: () => {},
            materias: { list: [] },
            characters: { maxMaterias: signal(0) },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewMateriaComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

describe('ViewMateriaComponent (real data)', () => {
  let game: GameService;
  let view: ViewMateriaComponent;
  let ice: Materia;

  const materia = (ref: MateriaRef) => {
    const found = game.materias.list.find((m) => m.ref === ref);
    if (!found) throw new Error(`${ref} not owned`);
    return found;
  };

  beforeEach(async () => {
    vi.stubGlobal('localStorage', new MemoryStorage());
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      imports: [ViewMateriaComponent],
      providers: [
        provideInMemoryGameData(),
        provideTranslateService({ fallbackLang: 'en' }),
      ],
    });
    game = await startGame(); // zone 1: Restore and Bolt equipped
    ice = TestBed.inject(StoreService).getMateria(MateriaRef.Ice);
    game.materias.add(ice);
    view = TestBed.createComponent(ViewMateriaComponent).componentInstance;
  });

  afterEach(() => {
    clearTimeout(game.timer);
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('has one slot per weapon slot of the team', () => {
    // Buster Sword (1) + Gatling Gun (1)
    expect(game.characters.maxMaterias()).toBe(2);
    expect(view.maxMaterias()).toBe(2);
  });

  it('shows the slots of the current team', () => {
    // zone 3: Cloud (Buster Sword, 1) and Aerith (Guard Stick, 2)
    game.zones.level = 3;
    game.zones.levelMax = 3;
    game.buildLevel(3);
    const fixture = TestBed.createComponent(ViewMateriaComponent);
    fixture.detectChanges();
    const total = () =>
      fixture.nativeElement
        .querySelector('thead th:last-child')
        .textContent.replace(/\s+/g, ' ')
        .trim();
    expect(total()).toBe('2 / 3');

    const aerith = game.characters.list.find(
      (c) => c.ref === CharacterRef.Aerith,
    );
    if (!aerith) throw new Error('Aerith not found');
    game.leaveTeam(aerith);
    fixture.detectChanges();
    // the materia in excess is unequipped
    expect(total()).toBe('1 / 1');
  });

  it('counts the weapon slots of the current team only', () => {
    // zone 3: Cloud (Buster Sword, 1) and Aerith (Guard Stick, 2)
    game.zones.level = 3;
    game.zones.levelMax = 3;
    game.buildLevel(3);
    expect(game.characters.maxMaterias()).toBe(3);
  });

  it('cannot equip a materia when all slots are used', () => {
    expect(view.getNbrEquipped()).toBe(2);
    expect(view.canEquip(ice)).toBe(false);
  });

  it('cannot equip an equipped materia', () => {
    view.unequip(materia(MateriaRef.Bolt));
    expect(view.canEquip(materia(MateriaRef.Restore))).toBe(false);
  });

  it('a freed slot can be used by another materia', () => {
    const bolt = materia(MateriaRef.Bolt);

    view.unequip(bolt);
    expect(bolt.equipped).toBe(false);
    expect(game.materias.getEquipped()).toHaveLength(1);
    expect(view.canEquip(ice)).toBe(true);

    view.equip(ice);
    expect(ice.equipped).toBe(true);
    expect(game.materias.getEquipped()).toEqual([
      materia(MateriaRef.Restore),
      ice,
    ]);
    expect(view.canEquip(bolt)).toBe(false);
  });
});
