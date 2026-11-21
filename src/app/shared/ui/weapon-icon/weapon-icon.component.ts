import { Component, input } from '@angular/core';

@Component({
  selector: 'app-weapon-icon',
  imports: [],
  template: `<img
    class="inline-block"
    src="/assets/images/icons/weapons/{{ type() }}.png"
    alt="weapon"
  />`,
})
export class WeaponIconComponent {
  readonly type = input('broadsword');
}
