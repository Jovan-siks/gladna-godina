import { Component, Input } from '@angular/core';
import { PrimaryButtonComponent } from '../primary-button/primary-button.component';
import { SecondaryButtonComponent } from '../secondary-button/secondary-button.component';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  imports: [SecondaryButtonComponent],
  standalone: true,
  template: `
    <div
      class="flex min-h-full h-full max-h-[800px] flex-col items-center justify-center px-6 py-12 lg:px-8"
    >
      <div
        class="w-full max-w-xl rounded-xl bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] shadow-lg p-8 transition"
      >
        <h2
          class="mb-8 text-center text-3xl font-extrabold tracking-tight text-[var(--foreground)]"
        >
          Sign up
        </h2>

        <form class="space-y-6">
          <!-- Full Name -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-[var(--foreground)]"
            >
              Full name
            </label>
            <input
              type="text"
              name="name"
              #name
              required
              class="mt-2 block w-full rounded-md bg-[var(--input)] px-4 py-2 text-base
                 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]
                 border border-[var(--border)] shadow-inner shadow-black/5
                 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition sm:text-sm"
            />
          </div>

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
              #email
              autocomplete="email"
              required
              class="mt-2 block w-full rounded-md bg-[var(--input)] px-4 py-2 text-base
                 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]
                 border border-[var(--border)] shadow-inner shadow-black/5
                 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition sm:text-sm"
            />
          </div>

          <!-- Password -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-[var(--foreground)]"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              #password
              autocomplete="current-password"
              required
              class="mt-2 block w-full rounded-md bg-[var(--input)] px-4 py-2 text-base
                 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]
                 border border-[var(--border)] shadow-inner shadow-black/5
                 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition sm:text-sm"
            />
          </div>

          <!-- CTA Buttons -->
          <div class="space-y-4">
            <button
              type="button"
              (click)="onSubmit(name.value, email.value, password.value)"
              class="flex w-full justify-center rounded-md bg-[var(--primary)] px-4 py-2
                 text-sm font-semibold text-[var(--primary-foreground)] shadow-md
                 hover:bg-[var(--primary)]/90 transition
                 focus-visible:outline-none focus-visible:ring-2
                 focus-visible:ring-offset-2 focus-visible:ring-[var(--ring)] cursor-pointer"
            >
              Sign up
            </button>

            <app-secondary-button
              label="Already have an account? Log in"
              (btnClicked)="switchView?.('login')"
            />
          </div>
        </form>
      </div>
    </div>
  `,
  styles: ``,
})
export class SignUpComponent {
  @Input() switchView?: (view: 'login' | 'signup') => void;

  errorMessage: string | null = '';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit(name: string, email: string, password: string) {
    if (!name || !email || !password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.userService.signup(name, email, password).subscribe({
      next: (response) => {
        console.log('Sign up successful:', response);
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/dashboard']);
        this.errorMessage = null; // Clear any previous error messages
      },
      error: (error) => {
        console.error('Sign up failed:', error);
        this.errorMessage = 'Sign up failed. Please try again.';
      },
    });
  }
}
