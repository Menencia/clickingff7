import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { PlayerService } from '@shared/services/player.service';
import { playerServiceMock } from '@shared/test/player.mock';
import { ViewMapComponent } from './view-map.component';

describe('ViewMapComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMapComponent],
      providers: [
        provideTranslateService(),
        { provide: PlayerService, useValue: playerServiceMock },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewMapComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
