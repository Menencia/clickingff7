import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-ui-layout-default',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './ui-layout-default.component.html',
})
export class UiLayoutDefaultComponent {}
