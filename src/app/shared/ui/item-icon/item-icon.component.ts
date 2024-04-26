import { Component } from '@angular/core';

@Component({
  selector: 'app-item-icon',
  standalone: true,
  imports: [],
  template: `<img
    class="inline-block"
    src="/assets/images/icons/item.gif"
    alt="item"
  />`,
})
export class ItemIconComponent {}
