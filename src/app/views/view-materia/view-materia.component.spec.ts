import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerService } from '@shared/services/player.service';
import { MockProvider } from 'ng-mocks';
import { CharactersMock, MateriasMock } from 'src/app/shared/test/game.mock';

import { ViewMateriaComponent } from './view-materia.component';

describe('ViewMateriaComponent', () => {
  let component: ViewMateriaComponent;
  let fixture: ComponentFixture<ViewMateriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMateriaComponent, TranslateModule.forRoot()],
      providers: [MockProvider(PlayerService, { ...MateriasMock, ...CharactersMock })],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewMateriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
