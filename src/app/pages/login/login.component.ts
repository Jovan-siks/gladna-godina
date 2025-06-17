import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogInComponent } from '../../components/log-in/log-in.component';
import { SignUpComponent } from '../../components/sign-up/sign-up.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LogInComponent, SignUpComponent],
  template: `
    <div>
      <h1 class="text-red-500 text-5xl font-bold text-center  p-4">
        {{ title }}!
      </h1>

      <div class="flex justify-center items-center h-[600px]">
        <app-log-in
          [ngClass]="{ hidden: currentView() !== 'login' }"
          [switchView]="switchView"
        />

        <app-sign-up
          [ngClass]="{ hidden: currentView() !== 'signup' }"
          [switchView]="switchView"
        />
      </div>
    </div>
  `,
  styles: ``,
})
export class LoginComponent {
  currentView = signal<'login' | 'signup'>('login');
  switchView = (view: 'login' | 'signup') => {
    console.log('Switching to view:', view);
    this.currentView.set(view);
  };
  title = 'Gladna godina';
}
