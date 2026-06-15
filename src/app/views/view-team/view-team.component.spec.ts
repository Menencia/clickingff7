import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { ViewTeamComponent } from './view-team.component';

describe('ViewTeamComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTeamComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewTeamComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
