import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { GameService } from '../../core/services/game.service';
import { StoreService } from '../../core/services/store.service';
import { CharacterRef } from '../../models/refs/characters';
import { WeaponRef } from '../../models/refs/weapons';
import { Weapon } from '../../models/weapon';
import {
  MemoryStorage,
  provideInMemoryGameData,
  startGame,
} from '../../testing/game-data.testing';
import { ViewEquipComponent } from './view-equip.component';

describe('ViewEquipComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEquipComponent],
      providers: [
        {
          provide: GameService,
          useValue: {
            run: () => {},
            characters: { team: signal([]), selected: signal(undefined) },
            weapons: { getAllWeapons: () => [] },
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewEquipComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

describe('ViewEquipComponent (real data)', () => {
  let game: GameService;

  const create = () =>
    TestBed.createComponent(ViewEquipComponent).componentInstance;

  const character = (ref: CharacterRef) => {
    const found = game.characters.list.find((c) => c.ref === ref);
    if (!found) throw new Error(`${ref} not found`);
    return found;
  };

  const isEquipped = (w: Weapon) =>
    game.weapons.isEquipped(w, game.characters.list);

  const weapon = (ref: WeaponRef) => {
    const found = game.weapons.list.find((w) => w.ref === ref);
    if (!found) throw new Error(`${ref} not owned`);
    return found;
  };

  beforeEach(async () => {
    vi.stubGlobal('localStorage', new MemoryStorage());
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      imports: [ViewEquipComponent],
      providers: [
        provideInMemoryGameData(),
        provideTranslateService({ fallbackLang: 'en' }),
      ],
    });
    game = await startGame(); // zone 1: Cloud and Barret
    game.weapons.add(
      TestBed.inject(StoreService).getWeapon(WeaponRef.MythrilSaber),
    );
  });

  afterEach(() => {
    clearTimeout(game.timer);
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('selects the first team member when the selected one left the team', () => {
    const cloud = character(CharacterRef.Cloud);
    const barret = character(CharacterRef.Barret);
    game.characters.select(barret);
    barret.inTeam = false;
    game.characters.refresh();

    const view = create();
    expect(view.selected()).toBe(cloud);
    expect(view.team()).toEqual([cloud]);
  });

  it('shows the current team', () => {
    const fixture = TestBed.createComponent(ViewEquipComponent);
    fixture.detectChanges();
    const buttons = () =>
      [...fixture.nativeElement.querySelectorAll('.team-picker button')].map(
        (b: HTMLElement) => b.textContent?.trim(),
      );
    expect(buttons()).toEqual([CharacterRef.Cloud, CharacterRef.Barret]);

    game.characters.leave(character(CharacterRef.Barret));
    fixture.detectChanges();
    expect(buttons()).toEqual([CharacterRef.Cloud]);
  });

  it('lists only the weapons of the selected character type', () => {
    const view = create();
    expect(view.selected()?.ref).toBe(CharacterRef.Cloud);
    expect(view.weapons().map((w) => w.ref)).toEqual([
      WeaponRef.BusterSword,
      WeaponRef.MythrilSaber,
    ]);

    view.selectCharacter(character(CharacterRef.Barret));
    expect(game.characters.selected()?.ref).toBe(CharacterRef.Barret);
    expect(view.weapons().map((w) => w.ref)).toEqual([WeaponRef.GatlingGun]);
  });

  it('follows the team when the selected character leaves it', () => {
    const fixture = TestBed.createComponent(ViewEquipComponent);
    const view = fixture.componentInstance;
    const barret = character(CharacterRef.Barret);
    view.selectCharacter(barret);
    fixture.detectChanges();
    expect(view.weapons().map((w) => w.ref)).toEqual([WeaponRef.GatlingGun]);

    game.characters.leave(barret);
    fixture.detectChanges();

    expect(view.selected()).toBe(character(CharacterRef.Cloud));
    expect(view.weapons().map((w) => w.ref)).toEqual([
      WeaponRef.BusterSword,
      WeaponRef.MythrilSaber,
    ]);
    const active = fixture.nativeElement.querySelector(
      '.team-picker .btn-secondary',
    );
    expect(active?.textContent?.trim()).toBe(CharacterRef.Cloud);
  });

  it('equipping a weapon unequips the previous one of the same type', () => {
    const view = create();
    const cloud = character(CharacterRef.Cloud);
    const busterSword = weapon(WeaponRef.BusterSword);
    const saber = weapon(WeaponRef.MythrilSaber);
    expect(view.canEquipWeapon(busterSword)).toBe(false);
    expect(view.canEquipWeapon(saber)).toBe(true);

    view.equipWeapon(saber);

    expect(cloud.weapon).toBe(saber);
    expect(isEquipped(saber)).toBe(true);
    expect(isEquipped(busterSword)).toBe(false);
    expect(view.canEquipWeapon(busterSword)).toBe(true);
    expect(view.canEquipWeapon(saber)).toBe(false);
  });

  it('equipping a weapon leaves the other characters untouched', () => {
    const view = create();
    const gatlingGun = weapon(WeaponRef.GatlingGun);

    view.equipWeapon(weapon(WeaponRef.MythrilSaber));

    expect(character(CharacterRef.Barret).weapon).toBe(gatlingGun);
    expect(isEquipped(gatlingGun)).toBe(true);
  });

  it('equipping a weapon recomputes the team stats', () => {
    const view = create();
    const cloud = character(CharacterRef.Cloud);
    const barret = character(CharacterRef.Barret);
    const before = game.characters.hits();

    view.equipWeapon(weapon(WeaponRef.MythrilSaber));

    expect(game.characters.hits()).toBeGreaterThan(before);
    expect(game.characters.hits()).toBe(cloud.getHits() + barret.getHits());
  });
});
