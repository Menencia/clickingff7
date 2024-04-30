import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestModule } from 'src/app/shared/test/test.module';

import { ViewMateriaComponent } from './view-materia.component';

describe('ViewMateriaComponent', () => {
  let component: ViewMateriaComponent;
  let fixture: ComponentFixture<ViewMateriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMateriaComponent, TestModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
