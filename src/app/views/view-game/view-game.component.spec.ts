import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UiActionsComponent } from '@shared/components/ui-actions/ui-actions.component';
import { PlayerService } from '@shared/services/player.service';
import { MockComponents, MockProvider } from 'ng-mocks';

import { CharactersPanelComponent } from './components/characters-panel/characters-panel.component';
import { ViewGameComponent } from './view-game.component';

describe('ViewGameComponent', () => {
  let component: ViewGameComponent;
  let fixture: ComponentFixture<ViewGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewGameComponent, ...MockComponents(UiActionsComponent, CharactersPanelComponent), TranslateModule.forRoot()],
      providers: [MockProvider(PlayerService)],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
