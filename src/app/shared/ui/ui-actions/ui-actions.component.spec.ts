import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';
import { GameService } from 'src/app/core/services/game.service';
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
        MockProvider(GameService, {
          ...ZonesMock,
          ...CharactersMock,
          ...MateriasMock,
          ...ItemsMock,
        }),
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
