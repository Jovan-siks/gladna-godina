// src/app/components/header.component.ts
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div
      class="flex justify-between px-4 py-3 bg-[var(--navbar)] text-[var(--foreground)] border-b border-[var(--border)] shadow-sm"
    >
      <a routerLink="/dashboard" class="text-2xl font-bold">
        <img [src]="logoImg" alt="site logo" class="h-14 w-14 scale-150 ml-8" />
      </a>
      <div class="flex items-center gap-4 font-bold">
        <a href="/panel">Panel</a>
        <button
          (click)="themeService.toggleTheme()"
          class="bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded-md transition hover:brightness-95 cursor-pointer"
        >
          <img
            *ngIf="themeService.theme() === 'light'; else sunIcon"
            src="/assets/icons/phosphor/moon.svg"
            alt=""
            class="w-6 h-6 text-white fill-white invert "
          />
          <ng-template #sunIcon>
            <img src="/assets/icons/phosphor/sun.svg" alt="" class="w-6 h-6 " />
          </ng-template>
        </button>

        <button
          class="bg-gray-200  text-[var(--primary-foreground)] px-4 py-2 rounded-md transition hover:brightness-95 cursor-pointer"
        >
          <img
            src="/assets/icons/phosphor/sign-out.svg"
            alt="logout"
            class="w-6 h-6 "
          />
        </button>
      </div>
    </div>
  `,
})
export class HeaderComponent {
  user = localStorage.getItem('user');
  readonly themeService = inject(ThemeService);
  logoImg: string = '/assets/images/logo.svg';
}
