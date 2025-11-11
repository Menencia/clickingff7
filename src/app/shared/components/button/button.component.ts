import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() id = `btn-id-${Date.now()}`;

  @Input() disabled = false;

  @Input() class: string | { [key: string]: boolean } = '';

  @Output() trigger = new EventEmitter();

  click(event: Event) {
    this.trigger.emit(event);
  }
}
