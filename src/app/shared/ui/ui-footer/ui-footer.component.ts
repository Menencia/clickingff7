import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-footer',
  imports: [],
  templateUrl: './ui-footer.component.html',
  styleUrls: ['./ui-footer.component.scss'],
})
export class UiFooterComponent {
  readonly version = input.required<string>();
}
