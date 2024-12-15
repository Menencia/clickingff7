import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';
import { GameService } from 'src/app/core/services/game.service';
import { StoreService } from 'src/app/core/services/store.service';

import { ViewSaveComponent } from './view-save.component';

describe('ViewSaveComponent', () => {
  let component: ViewSaveComponent;
  let fixture: ComponentFixture<ViewSaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [MockProvider(GameService, { saves: [] }), MockProvider(StoreService)],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
