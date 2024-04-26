import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnemiesPanelComponent } from './enemies-panel.component';

describe('EnemiesPanelComponent', () => {
  let component: EnemiesPanelComponent;
  let fixture: ComponentFixture<EnemiesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnemiesPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnemiesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
