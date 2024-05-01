import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponents, MockProvider } from 'ng-mocks';
import { GameService } from 'src/app/core/services/game.service';
import { UiActionsComponent } from 'src/app/shared/ui/ui-actions/ui-actions.component';

import { CharactersPanelComponent } from './components/characters-panel/characters-panel.component';
import { ViewGameComponent } from './view-game.component';

describe('ViewGameComponent', () => {
  let component: ViewGameComponent;
  let fixture: ComponentFixture<ViewGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ViewGameComponent,
        ...MockComponents(UiActionsComponent, CharactersPanelComponent),
        TranslateModule.forRoot(),
      ],
      providers: [MockProvider(GameService)],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
