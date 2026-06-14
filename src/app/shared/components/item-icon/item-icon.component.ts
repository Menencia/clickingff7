import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-item-icon',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<img class="inline-block" src="/assets/images/icons/item.gif" alt="item" />`,
})
export class ItemIconComponent {}
