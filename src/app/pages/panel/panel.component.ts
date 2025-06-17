import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-panel',
  imports: [],
  template: `
    <div
      class="flex h-[calc(100vh-3.5rem)] bg-[var(--background)] text-[var(--foreground)]  w-full px-20"
    >
      <!-- Sidebar -->
      <aside
        class="w-64 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] shadow-lg p-4 border-r border-[var(--sidebar-border)]"
      >
        <h2 class="text-xl font-semibold mb-6">Admin</h2>
        <nav class="flex flex-col space-y-2">
          <a
            href="#"
            class="px-3 py-2 rounded-md transition hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
            >Dashboard</a
          >
          <a
            href="#"
            class="px-3 py-2 rounded-md transition hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
            >Users</a
          >
          <a
            href="#"
            class="px-3 py-2 rounded-md transition hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
            >Settings</a
          >
        </nav>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col">
        <!-- Header -->
        <header
          class="bg-[var(--card)]/70 backdrop-blur-md border-b border-[var(--border)] shadow-sm p-4 flex justify-between items-center"
        >
          <h1 class="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
          <div class="flex items-center gap-4">
            <span class="text-[var(--muted-foreground)]">{{ user?.name }}</span>
            <img
              src="/assets/images/logo.svg"
              alt="Avatar"
              class="rounded-full w-8 h-8 border border-[var(--border)]"
            />
          </div>
        </header>

        <!-- Page Content -->
        <main class="p-6 overflow-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              class="rounded-xl border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md shadow-lg p-4 transition"
            >
              <h2 class="text-lg font-semibold mb-2 text-[var(--foreground)]">
                Card 1
              </h2>
              <p class="text-[var(--muted-foreground)]">
                Some stats or info...
              </p>
            </div>
            <div
              class="rounded-xl border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md shadow-lg p-4 transition"
            >
              <h2 class="text-lg font-semibold mb-2 text-[var(--foreground)]">
                Card 2
              </h2>
              <p class="text-[var(--muted-foreground)]">More data here...</p>
            </div>
            <div
              class="rounded-xl border border-[var(--border)] bg-[var(--card)]/70 backdrop-blur-md shadow-lg p-4 transition"
            >
              <h2 class="text-lg font-semibold mb-2 text-[var(--foreground)]">
                Card 3
              </h2>
              <p class="text-[var(--muted-foreground)]">Details or charts...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: ``,
})
export class PanelComponent implements OnInit {
  user: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
  }
}
