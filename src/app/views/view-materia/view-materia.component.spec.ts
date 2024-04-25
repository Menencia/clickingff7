import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMateriaComponent } from './view-materia.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

describe('ViewMateriaComponent', () => {
  let component: ViewMateriaComponent;
  let fixture: ComponentFixture<ViewMateriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewMateriaComponent],
      imports: [TranslateModule.forRoot(), SharedModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
