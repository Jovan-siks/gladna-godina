import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../pages/dashboard/dashboard.component';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  template: `
    <div
      class="block ml-8 rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-md shadow-xl overflow-x-auto transition-all max-w-[800px] mt-34"
    >
      <table class="w-full text-sm text-[var(--foreground)]">
        <thead
          class="text-xs text-[var(--muted-foreground)] uppercase tracking-wider backdrop-blur-md bg-[var(--card)]/50 border-b border-[var(--border)]"
        >
          <tr>
            <th class="px-6 py-4 text-left border border-[var(--border)]">
              Zaposleni
            </th>
            <!-- <th class="px-6 py-4 text-left border border-[var(--border)]">
              Uredi
            </th> -->
            <th class="px-6 py-4 text-left border border-[var(--border)]">
              Obriši
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            *ngFor="let user of users"
            class="hover:bg-[var(--muted)]/30 backdrop-blur transition-all"
          >
            <td class="px-6 py-3 border border-[var(--border)] font-semibold">
              {{ user.name }}
            </td>
            <!-- <td class="px-6 py-3 border border-[var(--border)]">
              <button
                class="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 px-4 py-2 rounded-md text-xs font-medium shadow transition"
              >
                Uredi
              </button>
            </td> -->
            <td class="px-6 py-3 border border-[var(--border)]">
              <button
                class="bg-[var(--destructive)] text-white hover:bg-[var(--destructive)]/90 px-4 py-2 rounded-md text-xs font-medium shadow transition cursor-pointer"
                (click)="deleteUser(user._id)"
              >
                Obriši
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: ``,
})
export class UsersComponent {
  @Input() users: User[] = [];
  constructor(private userService: UserService) {}

  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe((response) => {
      console.log(
        '🚀 ~ UsersComponent ~ this.userService.deleteUser ~ response:',
        response
      );
    });
  }
}
