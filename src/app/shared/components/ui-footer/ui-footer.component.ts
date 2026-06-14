import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-footer',
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './ui-footer.component.html',
})
export class UiFooterComponent {
  @Input() version = '0.1.0';
}
