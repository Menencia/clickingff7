import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-character-icon',
  template: `
    <div [style.background-image]="'url(' + unit.image + ')'"
         [class]="['character-icon', 'rarity-' + unit.rarity].join(' ')"
         [class.disabled]="disabled">
      <div class="d-flex justify-content-between">
        <div [style.background-image]="'url(/assets/elements.png)'"
             class="element" [class]="['element', 'element-' + unit.element].join(' ')"></div>
        <div class="align-self-center mr-1 level-info">Lv. {{unit.lvl}}</div>
      </div>
  </div>
  `,
  styles: [`
    .character-icon {
      border-width: .25rem;
      border-top-left-radius: 1rem!important;
      border-bottom-right-radius: 1rem!important;
      border-style: solid;
      width: 80px;
      height: 80px;
      background-size: cover;
      font-size: 0.8rem;
    }
    .disabled {
      opacity: 0.7;
    }
    .rarity-1 {
      border-color: #12aa80;
    }
    .rarity-2 {
      border-color: #1f7cc4;
    }
    .level-info {
      font-family: 'Catamaran';
      color: black;
      -webkit-text-fill-color: white; /* Will override color (regardless of order) */
      -webkit-text-stroke-width: 1px;
      -webkit-text-stroke-color: black;
    }
    .element {
      height: 24px;
      width: 24px;
      background-size: 70px;
    }
    .element-3 {
      background-position: 24px 0;
    }
  `]
})
export class CharacterIconComponent implements OnInit {

  @Input() unit;
  @Input() disabled;

  constructor() { }

  ngOnInit() {
  }

}
