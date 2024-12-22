import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerService } from '@shared/services/player.service';
import { MockProvider } from 'ng-mocks';

import { CharactersPanelComponent } from './characters-panel.component';

describe('CharactersPanelComponent', () => {
  let component: CharactersPanelComponent;
  let fixture: ComponentFixture<CharactersPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharactersPanelComponent, TranslateModule.forRoot()],
      providers: [MockProvider(PlayerService)],
    }).compileComponents();

    fixture = TestBed.createComponent(CharactersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
