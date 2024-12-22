import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerService } from '@shared/services/player.service';
import { MockProvider } from 'ng-mocks';

import { ViewConfigComponent } from './view-config.component';

describe('ViewConfigComponent', () => {
  let component: ViewConfigComponent;
  let fixture: ComponentFixture<ViewConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewConfigComponent, TranslateModule.forRoot()],
      providers: [MockProvider(PlayerService)],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
