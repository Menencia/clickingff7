import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() id = `btn-id-${new Date().getTime()}`;

  @Input() disabled = false;

  @Input() class: string | { [key: string]: boolean } = '';

  @Output() trigger = new EventEmitter();

  click() {
    this.trigger.emit();
  }
}
