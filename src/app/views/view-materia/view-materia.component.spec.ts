import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockProvider } from 'ng-mocks';
import { GameService } from 'src/app/core/services/game.service';
import { CharactersMock, MateriasMock } from 'src/app/shared/test/game.mock';

import { ViewMateriaComponent } from './view-materia.component';

describe('ViewMateriaComponent', () => {
  let component: ViewMateriaComponent;
  let fixture: ComponentFixture<ViewMateriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMateriaComponent, TranslateModule.forRoot()],
      providers: [MockProvider(GameService, { ...MateriasMock, ...CharactersMock })],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
