import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="flex flex-col items-center justify-center min-h-[300px] bg-[var(--background)] rounded-2xl shadow-lg p-8 border border-[var(--border)]"
    >
      <div
        class="text-7xl font-mono font-bold text-[var(--main)] mb-8 drop-shadow"
      >
        {{ time | date : 'HH:mm:ss' }}
      </div>

      <div class="flex items-center gap-6 mb-2">
        <button
          (click)="toggleRadio()"
          class="px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl shadow-md hover:bg-[var(--primary-hover)] transition-colors duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          {{ isPlaying ? 'Pause Radio' : 'Play Radio' }}
        </button>

        <div class="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            [(ngModel)]="volume"
            (input)="setVolume(volume)"
            class="w-36 h-2 accent-[var(--primary)] bg-[var(--muted)] rounded-lg appearance-none cursor-pointer"
          />
          <span class="text-xs text-[var(--muted-foreground)]"
            >{{ volume * 100 | number : '1.0-0' }}%</span
          >
        </div>
      </div>

      <audio #radioRef [src]="radioStreamUrl"></audio>
    </div>
  `,
})
export class ClockComponent implements OnInit, OnDestroy {
  time = new Date();
  intervalId!: ReturnType<typeof setInterval>;

  radioStreamUrl = 'https://vprclassical.streamguys1.com/vprclassical128.mp3';
  isPlaying = false;
  volume = 0.5;

  private audio!: HTMLAudioElement;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);

    // Setup audio
    this.audio = new Audio(this.radioStreamUrl);
    this.audio.volume = this.volume;
    this.audio.crossOrigin = 'anonymous';
  }

  toggleRadio(): void {
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play().catch((err) => console.error('Audio play error', err));
    }
    this.isPlaying = !this.isPlaying;
  }

  setVolume(val: number): void {
    this.audio.volume = val;
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    this.audio.pause();
    this.audio.src = '';
  }
}
