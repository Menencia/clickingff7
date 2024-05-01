import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';
import { GameService } from 'src/app/core/services/game.service';
import { CharactersMock, WeaponsMock } from 'src/app/shared/test/game.mock';

import { ViewEquipComponent } from './view-equip.component';

describe('ViewEquipComponent', () => {
  let component: ViewEquipComponent;
  let fixture: ComponentFixture<ViewEquipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEquipComponent, TranslateModule.forRoot()],
      providers: [
        MockProvider(GameService, { ...CharactersMock, ...WeaponsMock }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewEquipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
