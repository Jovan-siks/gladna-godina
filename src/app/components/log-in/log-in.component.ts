import { Component, Input } from '@angular/core';
import { SecondaryButtonComponent } from '../secondary-button/secondary-button.component';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-log-in',
  imports: [SecondaryButtonComponent, CommonModule],
  standalone: true,
  template: `
    <div
      class="flex min-h-full flex-col items-center justify-center px-6 py-12 lg:px-8 "
    >
      <div
        class="w-full max-w-md rounded-xl bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] shadow-xl p-8 transition"
      >
        <h2
          class="mb-8 text-center text-3xl font-extrabold tracking-tight text-[var(--foreground)]"
        >
          Log in to your account
        </h2>

        <form class="space-y-6">
          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-[var(--foreground)]"
            >
              Email address
            </label>
            <input
              type="email"
              name="email"
              autocomplete="email"
              required
              #email
              class="mt-2 block w-full rounded-md bg-[var(--input)] px-3 py-2 text-base
                 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]
                 border border-[var(--border)] shadow-inner shadow-black/5
                 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition sm:text-sm"
            />
          </div>

          <!-- Password + Forgot -->
          <div>
            <div class="flex items-center justify-between">
              <label
                for="password"
                class="block text-sm font-medium text-[var(--foreground)]"
              >
                Password
              </label>
              <a
                href="/reset-password"
                class="text-sm font-semibold text-[var(--primary)] hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              name="password"
              autocomplete="current-password"
              required
              #password
              class="mt-2 block w-full rounded-md bg-[var(--input)] px-3 py-2 text-base
                 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]
                 border border-[var(--border)] shadow-inner shadow-black/5
                 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition sm:text-sm"
            />
          </div>

          <!-- Submit + Switch View -->
          <div class="space-y-4">
            <button
              type="button"
              (click)="onLogin(email.value, password.value)"
              class="w-full flex justify-center rounded-md bg-[var(--primary)] px-4 py-2
                 text-sm font-semibold text-[var(--primary-foreground)] shadow-md
                 hover:bg-[var(--primary)]/90 transition focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ring)] cursor-pointer"
            >
              Log in
            </button>

            <app-secondary-button
              label="Don't have an account? Sign up"
              (btnClicked)="switchView?.('signup')"
            />
          </div>

          <!-- Error message -->
          <p
            *ngIf="errorMessage"
            class="text-sm text-red-600 font-medium text-center"
          >
            {{ errorMessage }}
          </p>
        </form>
      </div>
    </div>
  `,
  styles: ``,
})
export class LogInComponent {
  errorMessage: string | null = '';
  @Input() switchView?: (view: 'login' | 'signup') => void;

  constructor(private userService: UserService, private router: Router) {}
  isLoading = false;

  onLogin(email: string, password: string) {
    if (!email || !password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.userService.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'Invalid email or password'; // User-friendly message
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
