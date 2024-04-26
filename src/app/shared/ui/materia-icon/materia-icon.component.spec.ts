import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MateriaIconComponent } from './materia-icon.component';

describe('MateriaIconComponent', () => {
  let component: MateriaIconComponent;
  let fixture: ComponentFixture<MateriaIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MateriaIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MateriaIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
