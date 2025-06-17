import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="bg-[var(--background)] text-[var(--foreground)]">
      <app-header />
      <div
        class=" flex flex-col justify-center align-center py-12 sm:px-6 lg:px-8 w-full overflow-auto "
      >
        <router-outlet />
      </div>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  title = 'Gladna godina';
}
