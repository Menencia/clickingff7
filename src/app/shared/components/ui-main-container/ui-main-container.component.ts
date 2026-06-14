import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-ui-main-container',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './ui-main-container.component.html',
})
export class UiMainContainerComponent {}
