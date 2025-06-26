import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="flex h-screen  flex-col items-center justify-center px-6 py-12 lg:px-8"
    >
      <div
        class="w-full max-w-md rounded-xl bg-[var(--card)]/70 backdrop-blur-md border border-[var(--border)] shadow-xl p-8 transition"
      >
        <h2
          class="mb-8 text-center text-3xl font-extrabold tracking-tight text-[var(--foreground)]"
        >
          Reset your password
        </h2>

        <!-- Step 1: Email Input -->
        <form class="space-y-6" *ngIf="!userId">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-[var(--foreground)]"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              [(ngModel)]="email"
              name="email"
              autocomplete="email"
              required
              class="mt-2 block w-full rounded-md bg-[var(--input)] px-3 py-2 text-base text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] border border-[var(--border)] shadow-inner shadow-black/5 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition sm:text-sm"
            />
          </div>

          <button
            type="button"
            (click)="findUser()"
            class="w-full flex justify-center rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-md hover:bg-[var(--primary)]/90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ring)] cursor-pointer"
          >
            Next
          </button>
        </form>

        <!-- Step 2: New Password Input -->
        <form class="space-y-6" *ngIf="userId">
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-[var(--foreground)]"
            >
              New password
            </label>
            <input
              type="password"
              id="password"
              [(ngModel)]="newPassword"
              name="password"
              autocomplete="new-password"
              required
              class="mt-2 block w-full rounded-md bg-[var(--input)] px-3 py-2 text-base text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] border border-[var(--border)] shadow-inner shadow-black/5 focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition sm:text-sm"
            />
          </div>

          <button
            type="button"
            [disabled]="isSubmitting"
            (click)="resetPassword()"
            class="w-full flex justify-center rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] shadow-md hover:bg-[var(--primary)]/90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ring)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {{ isSubmitting ? 'Submitting...' : 'Reset Password' }}
          </button>
        </form>

        <!-- Message -->
        <p
          *ngIf="message"
          class="mt-4 text-sm font-medium text-center text-[var(--muted-foreground)]"
        >
          {{ message }}
        </p>
      </div>
    </div>
  `,
})
export class ResetPasswordComponent {
  email = '';
  newPassword = '';
  userId: string | null = null;
  message = '';
  isSubmitting = false;

  constructor(private userService: UserService, private router: Router) {}

  findUser() {
    if (!this.email) {
      this.message = 'Please enter your email.';
      return;
    }

    this.userService.getUserByEmail(this.email).subscribe({
      next: (user) => {
        this.userId = user._id;
        this.message = 'Email found. Please enter a new password.';
      },
      error: () => {
        this.message = 'User not found.';
      },
    });
  }

  resetPassword() {
    if (!this.newPassword || !this.userId || this.isSubmitting) return;

    this.isSubmitting = true;

    this.userService
      .updateUser(this.userId, { password: this.newPassword })
      .subscribe({
        next: () => {
          this.message = 'Password updated successfully. Redirecting...';
          setTimeout(() => this.router.navigate(['/']), 2000);
        },
        error: () => {
          this.message = 'Something went wrong. Please try again.';
          this.isSubmitting = false;
        },
      });
  }
}
