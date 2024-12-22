import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '@shared/components/button/button.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-confirm-button',
  standalone: true,
  providers: [ConfirmationService],
  imports: [ConfirmDialogModule, ButtonComponent],
  templateUrl: './confirm-button.component.html',
  styleUrl: './confirm-button.component.scss',
})
export class ConfirmButtonComponent {
  @Input() message = '';

  @Input() disabled = false;

  @Output() confirm = new EventEmitter<boolean>();

  constructor(public confirmationService: ConfirmationService) {}

  onConfirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.message,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.confirm.emit(true);
      },
      reject: () => {
        this.confirm.emit(false);
      },
    });
  }
}
