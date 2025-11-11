import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-ui-footer',
    imports: [],
    templateUrl: './ui-footer.component.html',
    styleUrls: ['./ui-footer.component.scss']
})
export class UiFooterComponent {
  @Input() version = '0.1.0';
}
