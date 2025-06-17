import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [RouterLink],
  template: `
    <button
      [type]="type()"
      [routerLink]="routerLink()"
      (click)="handleClick()"
      [attr.aria-label]="label()"
      class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
    >
      {{ label() }}
    </button>
  `,
})
export class PrimaryButtonComponent {
  label = input('');
  type = input<'submit' | 'button'>('button');
  routerLink = input<string | any[] | null>(null);
  btnClicked = output<void>();

  handleClick() {
    if (this.type() === 'button') {
      this.btnClicked.emit();
    }
    // Do not emit if it's 'submit' — Angular will handle it via (ngSubmit)
  }
}
