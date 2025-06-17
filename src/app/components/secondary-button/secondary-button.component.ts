import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-secondary-button',
  imports: [],
  template: `
    <button
      (click)="btnClicked.emit()"
      class="flex w-full justify-center rounded-md border border-[var(--primary)] px-4 py-2
         text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary)]/10
         shadow-sm transition cursor-pointer
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ring)] cursor-pointer"
    >
      {{ label() }}
    </button>
  `,
  styles: ``,
})
export class SecondaryButtonComponent {
  label = input('');

  btnClicked = output();
}
