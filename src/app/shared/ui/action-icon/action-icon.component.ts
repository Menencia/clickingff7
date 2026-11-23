import { Component, input } from '@angular/core';

export type ActionIconName =
  | 'flask-round'
  | 'orb'
  | 'swords'
  | 'skull'
  | 'sword'
  | 'zap'
  | 'footprints'
  | 'lightbulb';

/**
 * Lucide icon of an action, inlined: importing @lucide/angular would put the
 * whole library in the initial bundle. `orb` is Lucide "circle", filled to
 * look like a materia. The color comes from the host text color.
 */
@Component({
  selector: 'app-action-icon',
  templateUrl: './action-icon.component.html',
  host: { class: 'inline-block size-5 flex-none' },
})
export class ActionIconComponent {
  readonly name = input.required<ActionIconName>();
}
