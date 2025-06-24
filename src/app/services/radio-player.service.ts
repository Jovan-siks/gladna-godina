import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RadioPlayerService {
  private audio = new Audio();
  private isPlaying = false;
  private station: { id: string; name: string; url: string } | null = null;

  constructor() {
    const savedVolume = sessionStorage.getItem('radioVolume');
    this.audio.volume = savedVolume ? parseFloat(savedVolume) : 0.5;
    this.audio.crossOrigin = 'anonymous';

    const savedIsPlaying = sessionStorage.getItem('radioIsPlaying') === 'true';
    const savedUrl = sessionStorage.getItem('radioStationUrl');
    const savedName = sessionStorage.getItem('radioStationName');
    const savedId = sessionStorage.getItem('radioStationId');

    if (savedUrl && savedName && savedId) {
      this.station = { id: savedId, name: savedName, url: savedUrl };
      this.audio.src = savedUrl;
    }

    this.isPlaying = savedIsPlaying;

    if (this.isPlaying && this.station) {
      this.audio.play().catch((err) => console.warn('Autoplay blocked:', err));
    }
  }

  play(stationUrl?: string) {
    if (stationUrl && this.audio.src !== stationUrl) {
      this.audio.src = stationUrl;
    }
    this.audio.play().catch((err) => console.warn('Play error:', err));
    this.isPlaying = true;
    sessionStorage.setItem('radioIsPlaying', 'true');
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    sessionStorage.setItem('radioIsPlaying', 'false');
  }

  toggle(stationUrl?: string) {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play(stationUrl);
    }
  }

  setStation(station: { id: string; name: string; url: string }) {
    this.station = station;
    this.audio.src = station.url;
    sessionStorage.setItem('radioStationId', station.id);
    sessionStorage.setItem('radioStationName', station.name);
    sessionStorage.setItem('radioStationUrl', station.url);
    if (this.isPlaying) this.audio.play().catch(console.warn);
  }

  getStationId(): string | null {
    return this.station?.id ?? null;
  }

  getStation(): { id: string; name: string; url: string } | null {
    return this.station;
  }

  setVolume(val: number) {
    this.audio.volume = val;
    sessionStorage.setItem('radioVolume', val.toString());
  }

  getVolume(): number {
    return this.audio.volume;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}
