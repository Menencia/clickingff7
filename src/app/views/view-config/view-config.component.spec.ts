import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';
import { GameService } from 'src/app/core/services/game.service';

import { ViewConfigComponent } from './view-config.component';

describe('ViewConfigComponent', () => {
  let component: ViewConfigComponent;
  let fixture: ComponentFixture<ViewConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewConfigComponent, TranslateModule.forRoot()],
      providers: [MockProvider(GameService)],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
