import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { PlayerService } from '@shared/services/player.service';
import { playerServiceMock } from '@shared/test/player.mock';
import { UiActionsComponent } from './ui-actions.component';

describe('UiActionsComponent', () => {
  let component: UiActionsComponent;
  let fixture: ComponentFixture<UiActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiActionsComponent],
      providers: [
        provideTranslateService(),
        { provide: PlayerService, useValue: playerServiceMock },
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
