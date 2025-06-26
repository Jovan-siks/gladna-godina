// src/app/components/header.component.ts
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <header
      class="flex justify-between px-4 py-3 bg-[var(--navbar)] text-[var(--foreground)] border-b border-[var(--border)] shadow-sm fixed top-0 w-full z-50"
    >
      <a routerLink="/dashboard" class="text-2xl font-bold">
        <img [src]="logoImg" alt="site logo" class="h-14 w-14 scale-150 ml-8" />
      </a>
      <nav class="flex items-center gap-4 font-bold">
        <a
          *ngIf="user"
          (click)="redirectToPanel(user.role)"
          class="cursor-pointer hover:underline hover:underline-offset-4 transition-all"
          [ngClass]="user ? 'display-block' : 'hidden'"
        >
          Panel
        </a>
        <button
          (click)="themeService.toggleTheme()"
          class="bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded-md transition hover:brightness-95 cursor-pointer"
        >
          <img
            *ngIf="themeService.theme() === 'light'; else sunIcon"
            src="/assets/icons/phosphor/moon.svg"
            alt=""
            class="size-6 text-white fill-white invert "
          />
          <ng-template #sunIcon>
            <img src="/assets/icons/phosphor/sun.svg" alt="" class="size-6 " />
          </ng-template>
        </button>

        <button
          class="bg-gray-200  text-[var(--primary-foreground)] px-4 py-2 rounded-md transition hover:brightness-95 cursor-pointer"
          (click)="logout()"
          [ngClass]="user ? 'display-block' : 'hidden'"
        >
          <img
            src="/assets/icons/phosphor/sign-out.svg"
            alt="logout"
            class="size-6 "
          />
        </button>
      </nav>
    </header>
  `,
})
export class HeaderComponent {
  user = JSON.parse(localStorage.getItem('user') || 'null');

  readonly themeService = inject(ThemeService);
  logoImg: string = '/assets/images/2.png';

  constructor(private userService: UserService, private router: Router) {}

  redirectToPanel(role: string) {
    if (role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/panel']);
    }
  }

  logout() {
    this.userService.logout();
  }
}
