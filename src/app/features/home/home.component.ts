import { Component, signal, computed, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { F1DataService } from '../../core/services/f1-data.service';
import { Race } from '../../core/models/f1.models';
import { RaceCardComponent } from '../../shared/components/race-card/race-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RaceCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private f1Service = inject(F1DataService);

  readonly selectedSeason = signal(new Date().getFullYear());
  readonly races = signal<Race[]>([]);
  readonly loading = this.f1Service.loading;
  readonly error = this.f1Service.error;

  readonly seasons = [2026, 2025, 2024, 2023, 2022];

  constructor() {
    effect(() => {
      const season = this.selectedSeason();
      this.loadSchedule(season);
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadSchedule(this.selectedSeason());
  }

  private async loadSchedule(season: number): Promise<void> {
    const data = await this.f1Service.getSeasonSchedule(season);
    this.races.set(data);
  }

  onSeasonChange(event: Event): void {
    const value = parseInt((event.target as HTMLSelectElement).value);
    this.selectedSeason.set(value);
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }

  getStatusCounts() {
    const races = this.races();
    return {
      passed: races.filter(r => r.status === 'passed').length,
      current: races.filter(r => r.status === 'current').length,
      upcoming: races.filter(r => r.status === 'upcoming').length,
    };
  }
}