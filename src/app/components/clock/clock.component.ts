import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RadioApiService } from '../../services/radio-api.service';
import { RadioPlayerService } from '../../services/radio-player.service';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="flex flex-col items-center justify-center min-h-[300px] bg-[var(--background)] rounded-2xl shadow-lg p-8 border border-[var(--border)] text-[var(--foreground)]"
    >
      <div class="text-7xl font-mono font-bold mb-6 drop-shadow">
        {{ time | date : 'HH:mm:ss' }}
      </div>
      <div class="flex items-center gap-2">
        <button
          (click)="prevStation()"
          class="text-xl px-2 py-1 rounded bg-[var(--primary)] transition cursor-pointer"
          [disabled]="stations.length <= 1"
          aria-label="Previous Station"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 fill-[var(--primary-foreground)]"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path
              d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"
            ></path>
          </svg>
        </button>

        <label for="station-select" class="font-bold text-lg">Station:</label>
        <select
          id="station-select"
          [(ngModel)]="currentStationIndex"
          (change)="onStationSelect()"
          class="px-2 py-1 rounded bg-[var(--card)] text-[var(--foreground)] cursor-pointer text-xl font-semibold max-w-[200px] focus:outline-none focus:ring-none"
        >
          <option *ngFor="let s of stations; let i = index" [value]="i">
            {{ s.name }}
          </option>
        </select>

        <button
          (click)="nextStation()"
          class="text-xl px-2 py-1 rounded bg-[var(--primary)] transition cursor-pointer"
          [disabled]="stations.length <= 1"
          aria-label="Next Station"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 fill-[var(--primary-foreground)]"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path
              d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"
            ></path>
          </svg>
        </button>
      </div>

      <div class="flex flex-col items-center gap-4 mt-4">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          [(ngModel)]="volume"
          (input)="setVolume(volume)"
          class="w-full h-2 accent-[var(--primary)] bg-[var(--muted)] rounded-lg appearance-none cursor-pointer"
        />
        <span
          class="text-sm text-[var(--muted-foreground)] min-w-[40px] text-right"
        >
          {{ volume * 100 | number : '1.0-0' }}%
        </span>
        <button
          (click)="toggleRadio()"
          class="px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-xl shadow-md transition font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
          [disabled]="!stationUrl"
        >
          {{ isPlaying ? 'Pause Radio' : 'Play Radio' }}
        </button>
      </div>
    </div>
  `,
})
export class ClockComponent implements OnInit, OnDestroy {
  private radioApi = inject(RadioApiService);

  time = new Date();
  intervalId!: ReturnType<typeof setInterval>;

  stations: any[] = [];
  currentStationIndex = 0;

  stationUrl = '';
  stationName = '';

  isPlaying = false;
  volume = 0.5;

  constructor(private radioPlayer: RadioPlayerService) {}

  ngOnInit(): void {
    this.intervalId = setInterval(() => (this.time = new Date()), 1000);

    this.volume = this.radioPlayer.getVolume();
    this.isPlaying = this.radioPlayer.getIsPlaying();

    // If service already has stations loaded, reuse them
    if (this.radioPlayerStationsExist()) {
      this.stations = this.radioPlayerGetStations();
      this.restoreStationFromService();
    } else {
      // Load stations from API and set them in service
      this.radioApi
        .getTopStationsByCountry('Montenegro')
        .subscribe((stations) => {
          this.stations = stations.filter((s) => s.url_resolved);
          this.radioPlayerSetStations(this.stations);

          // Restore saved station or use first
          const savedStationId = this.radioPlayer.getStationId();
          if (savedStationId) {
            const idx = this.stations.findIndex(
              (s) => s.stationuuid === savedStationId
            );
            this.currentStationIndex = idx >= 0 ? idx : 0;
          } else {
            this.currentStationIndex = 0;
          }
          this.radioPlayer.setStation({
            id: this.stations[this.currentStationIndex].stationuuid,
            name: this.stations[this.currentStationIndex].name,
            url: this.stations[this.currentStationIndex].url_resolved,
          });
          this.updateLocalStationInfo();
        });
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  private radioPlayerStationsExist(): boolean {
    // For simplicity, we keep stations in the component here.
    // If you want to move stations to the service, add logic here.
    return this.stations.length > 0;
  }

  private radioPlayerGetStations(): any[] {
    return this.stations;
  }

  private radioPlayerSetStations(stations: any[]) {
    // No-op here unless you move stations into service state
  }

  private restoreStationFromService() {
    const station = this.radioPlayer.getStation();
    if (station) {
      this.currentStationIndex = this.stations.findIndex(
        (s) => s.stationuuid === station.id
      );
      this.stationUrl = station.url;
      this.stationName = station.name;
    }
  }

  prevStation(): void {
    if (this.stations.length <= 1) return;
    this.currentStationIndex =
      (this.currentStationIndex - 1 + this.stations.length) %
      this.stations.length;
    this.selectStationByIndex(this.currentStationIndex);
  }

  nextStation(): void {
    if (this.stations.length <= 1) return;
    this.currentStationIndex =
      (this.currentStationIndex + 1) % this.stations.length;
    this.selectStationByIndex(this.currentStationIndex);
  }

  onStationSelect(): void {
    this.selectStationByIndex(this.currentStationIndex);
  }

  private selectStationByIndex(index: number) {
    const station = this.stations[index];
    if (!station) return;

    this.radioPlayer.setStation({
      id: station.stationuuid,
      name: station.name,
      url: station.url_resolved,
    });
    this.updateLocalStationInfo();
  }

  toggleRadio(): void {
    this.radioPlayer.toggle(this.stationUrl);
    this.isPlaying = this.radioPlayer.getIsPlaying();
  }

  setVolume(val: number): void {
    this.volume = val;
    this.radioPlayer.setVolume(val);
  }

  private updateLocalStationInfo() {
    const station = this.radioPlayer.getStation();
    if (station) {
      this.stationName = station.name;
      this.stationUrl = station.url;
    }
  }
}
