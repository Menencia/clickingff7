import { Component, Input } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TranslateModule } from '@ngx-translate/core'

import { GameComponent } from './game.component'

@Component({selector: 'app-bar', template: ''})
class AppBarStubComponent { }

@Component({selector: 'app-actions', template: ''})
class AppActionsStubComponent {
  @Input() progress: number = 0
  @Input() text: string = ''
  @Input() name: string = ''
  @Input() hits: number[] = []
}

describe('GameComponent', () => {
  let component: GameComponent
  let fixture: ComponentFixture<GameComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameComponent, AppBarStubComponent, AppActionsStubComponent ],
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: []
    })
    .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
