import { Component, input } from '@angular/core';
import { WeaponType } from '../../../models/weapon-type';

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
  readonly type = input<WeaponType>('broadsword');
}
