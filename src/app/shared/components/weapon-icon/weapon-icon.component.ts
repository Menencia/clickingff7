import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-weapon-icon',
  template: `<img class="inline-block" src="/images/icons/weapons/{{ type }}.png" alt="weapon" />`,
})
export class WeaponIconComponent {
  @Input() type = 'broadsword';
}
