import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="bg-[var(--background)] m-0 p-0 text-[var(--foreground)]">
      <app-header />
      <div
        class=" flex flex-col justify-center align-center  w-full overflow-auto "
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
