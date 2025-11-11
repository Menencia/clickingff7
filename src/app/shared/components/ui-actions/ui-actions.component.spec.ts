import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerService } from '@shared/services/player.service';
import { MockProvider } from 'ng-mocks';
import {
  CharactersMock,
  ItemsMock,
  MateriasMock,
  ZonesMock,
} from 'src/app/shared/test/game.mock';

import { UiActionsComponent } from './ui-actions.component';

describe('UiActionsComponent', () => {
  let component: UiActionsComponent;
  let fixture: ComponentFixture<UiActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiActionsComponent, TranslateModule.forRoot()],
      providers: [
        MockProvider(PlayerService, {
          ...ZonesMock,
          ...CharactersMock,
          ...MateriasMock,
          ...ItemsMock,
        }),
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UiActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
