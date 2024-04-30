import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestModule } from 'src/app/shared/test/test.module';

import { CharactersPanelComponent } from './characters-panel.component';

describe('CharactersPanelComponent', () => {
  let component: CharactersPanelComponent;
  let fixture: ComponentFixture<CharactersPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharactersPanelComponent, TestModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CharactersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
