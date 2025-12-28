import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-confirm-button',
  imports: [ButtonComponent],
  templateUrl: './confirm-button.component.html',
  styleUrl: './confirm-button.component.scss',
})
export class ConfirmButtonComponent {
  @Input() message = '';

  @Input() disabled = false;

  @Output() confirm = new EventEmitter<boolean>();

  onConfirm(event: Event) {
    // this.confirmationService.confirm({
    //   target: event.target as EventTarget,
    //   message: this.message,
    //   header: 'Confirmation',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     this.confirm.emit(true);
    //   },
    //   reject: () => {
    //     this.confirm.emit(false);
    //   },
    // });
  }
}
