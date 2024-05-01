import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';
import { GameService } from 'src/app/core/services/game.service';
import { CharactersMock } from 'src/app/shared/test/game.mock';

import { ViewPhsComponent } from './view-phs.component';

describe('ViewPhsComponent', () => {
  let component: ViewPhsComponent;
  let fixture: ComponentFixture<ViewPhsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [MockProvider(GameService, { ...CharactersMock })],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewPhsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
