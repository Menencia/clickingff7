import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { GameService } from '../../../../core/services/game.service';
import { Character } from '../../../../models/character';
import { CharacterRef } from '../../../../models/refs/characters';
import { WeaponRef } from '../../../../models/refs/weapons';
import { Characters } from '../../../../models/units/characters';
import { Weapon } from '../../../../models/weapon';
import { CharactersPanelComponent } from './characters-panel.component';

function makeCharacter(level: number): Character {
  const weapon = new Weapon({
    ref: WeaponRef.BusterSword,
    type: 'broadsword',
    hits: 10,
    price: 0,
    maxMaterias: 1,
    zoneAvailable: 1,
  });
  return new Character({
    ref: CharacterRef.Cloud,
    image: 'cloud',
    weaponType: 'broadsword',
    weapon,
    hp: 3,
    mp: 3,
    xp: 3,
  }).setLevel(level);
}

describe('CharactersPanelComponent', () => {
  let fixture: ComponentFixture<CharactersPanelComponent>;
  let characters: Characters;

  function labels(): string[] {
    return Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll(
        '.progress-label',
      ),
    ).map((e) => e.textContent?.trim() ?? '');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharactersPanelComponent],
      providers: [
        provideTranslateService({ fallbackLang: 'en' }),
        { provide: GameService, useValue: { zones: { levelMax: 1 } } },
      ],
    }).compileComponents();

    characters = new Characters();
    characters.add(makeCharacter(2), true);
    characters.refresh();
    characters.hp.set(characters.hpMax());
    characters.mp.set(characters.mpMax());

    fixture = TestBed.createComponent(CharactersPanelComponent);
    fixture.componentRef.setInput('characters', characters);
    await fixture.whenStable();
  });

  it('displays HP, MP, limit and the team', () => {
    expect(labels()).toEqual(['HP 40', 'MP 6', 'LIMIT 0%', '0 / 200EXP']);
  });

  // Battle and timers change these signals outside of any event handler:
  // the OnPush panel must re-render on its own.
  it('re-renders when MP, limit or HP change outside an event', async () => {
    characters.mp.set(2);
    characters.limit.set(characters.limitMax() / 2);
    characters.hp.set(10);
    await fixture.whenStable();

    expect(labels().slice(0, 3)).toEqual(['HP 10', 'MP 2', 'LIMIT 50%']);
  });

  it('fills the bars with rounded percentages', async () => {
    characters.hp.set(10);
    characters.mp.set(2);
    await fixture.whenStable();

    const values = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('progress'),
    ).map((e) => e.value);
    expect(values).toEqual([25, 33, 0, 0]);
  });

  it('re-renders XP and level after a refresh', async () => {
    const [cloud] = characters.list;
    cloud.setXp(250);
    characters.refresh();
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('LVL3');
    expect(labels()[3]).toBe('50 / 300EXP');
  });
});
