import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { F1DataService } from '../../core/services/f1-data.service';
import { TimeService } from '../../core/services/time.service';
import { Standings } from '../../core/models/f1.models';

@Component({
  selector: 'app-standings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './standings.component.html',
  styleUrl: './standings.component.css',
})
export class StandingsComponent implements OnInit {
  private f1Service = inject(F1DataService);

  readonly selectedSeason = signal(new Date().getFullYear());
  readonly driverStandings = signal<Standings[]>([]);
  readonly constructorStandings = signal<Standings[]>([]);
  readonly activeTab = signal<'drivers' | 'constructors'>('drivers');
  readonly loading = this.f1Service.loading;
  readonly error = this.f1Service.error;

  readonly seasons = [2026, 2025, 2024, 2023, 2022];

  readonly currentStandings = computed(() =>
    this.activeTab() === 'drivers'
      ? this.driverStandings()
      : this.constructorStandings()
  );

  readonly totalPoints = computed(() => {
    const standings = this.currentStandings();
    if (standings.length === 0) return 0;
    return standings[0].points;
  });

  readonly remainingRaces = signal(0);

  constructor() {
    // Auto-load on init
  }

  async ngOnInit(): Promise<void> {
    await this.loadStandings(this.selectedSeason());
  }

  async loadStandings(year: number): Promise<void> {
    this.selectedSeason.set(year);
    const [drivers, constructors] = await Promise.all([
      this.f1Service.getDriverStandings(year),
      this.f1Service.getConstructorStandings(year),
    ]);
    this.driverStandings.set(drivers);
    this.constructorStandings.set(constructors);
  }

  async onSeasonChange(event: Event): Promise<void> {
    const year = parseInt((event.target as HTMLSelectElement).value);
    await this.loadStandings(year);
  }

  setTab(tab: 'drivers' | 'constructors'): void {
    this.activeTab.set(tab);
  }

  getRemainingRaces(): number {
    return 0;
  }
}