import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ViewMateriaComponent } from './view-materia.component';

describe('ViewMateriaComponent', () => {
  let component: ViewMateriaComponent;
  let fixture: ComponentFixture<ViewMateriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMateriaComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
