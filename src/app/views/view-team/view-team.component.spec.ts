import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';
import { GameService } from 'src/app/core/services/game.service';
import { CharactersMock } from 'src/app/shared/test/game.mock';

import { ViewTeamComponent } from './view-team.component';

describe('ViewTeamComponent', () => {
  let component: ViewTeamComponent;
  let fixture: ComponentFixture<ViewTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [MockProvider(GameService, { ...CharactersMock })],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
