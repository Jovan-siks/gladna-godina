import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="absolute  bg-black/40 flex items-center justify-center z-50"
      *ngIf="open"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 class="text-lg font-semibold mb-4">Confirm Delete</h2>
        <p class="mb-6">Are you sure you want to delete this item?</p>
        <div class="flex justify-end gap-2">
          <button
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            (click)="cancel.emit()"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            (click)="confirm.emit()"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DeleteConfirmModalComponent {
  @Input() open = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
