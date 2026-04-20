import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { F1DataService } from '../../core/services/f1-data.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { TimeService } from '../../core/services/time.service';
import { Race, Result, Standings } from '../../core/models/f1.models';

type Tab = 'schedule' | 'race' | 'qualifying' | 'standings' | 'circuit';

@Component({
  selector: 'app-race-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './race-detail.component.html',
  styleUrl: './race-detail.component.css',
})
export class RaceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private f1Service = inject(F1DataService);
  private favoritesService = inject(FavoritesService);
  readonly timeService = inject(TimeService);

  readonly race = signal<Race | null>(null);
  readonly raceResults = signal<Result[]>([]);
  readonly qualifyingResults = signal<Result[]>([]);
  readonly driverStandings = signal<Standings[]>([]);
  readonly constructorStandings = signal<Standings[]>([]);
  readonly loading = this.f1Service.loading;
  readonly error = this.f1Service.error;

  readonly activeTab = signal<Tab>('schedule');
  readonly activeStandingsTab = signal<'drivers' | 'constructors'>('drivers');

  readonly year = signal(2024);
  readonly round = signal(1);
  readonly raceId = computed(() => `${this.year()}-${this.round()}`);

  readonly isFavorite = computed(() => this.favoritesService.isFavorite(this.raceId()));

  readonly tabs = computed(() => {
    const race = this.race();
    if (!race) return [];

    switch (race.status) {
      case 'passed':
        return [
          { id: 'race', label: 'Carrera', icon: 'flag' },
          { id: 'qualifying', label: 'Qualy', icon: 'clock' },
          { id: 'standings', label: 'Campeonato', icon: 'trophy' },
          { id: 'circuit', label: 'Circuito', icon: 'map' },
        ];
      case 'current':
        return [
          { id: 'schedule', label: 'Horarios', icon: 'calendar' },
          { id: 'race', label: 'Carrera', icon: 'flag' },
          { id: 'qualifying', label: 'Qualy', icon: 'clock' },
        ];
      case 'upcoming':
      default:
        return [
          { id: 'schedule', label: 'Horarios', icon: 'calendar' },
          { id: 'circuit', label: 'Circuito', icon: 'map' },
        ];
    }
  });

  readonly currentStandings = computed(() =>
    this.activeStandingsTab() === 'drivers'
      ? this.driverStandings()
      : this.constructorStandings()
  );

  async ngOnInit(): Promise<void> {
    const params = this.route.snapshot.paramMap;
    const year = parseInt(params.get('year') || '2024');
    const round = parseInt(params.get('round') || '1');

    this.year.set(year);
    this.round.set(round);

    await this.loadRaceData(year, round);
  }

  private async loadRaceData(year: number, round: number): Promise<void> {
    const races = await this.f1Service.getSeasonSchedule(year);
    const race = races.find((r) => r.id === `${year}-${round}`);
    this.race.set(race || null);

    if (race) {
      if (race.status === 'passed' || race.status === 'current') {
        const [results, qualy, drivers, constructors] = await Promise.all([
          this.f1Service.getRaceResults(year, round),
          this.f1Service.getQualifyingResults(year, round),
          this.f1Service.getDriverStandings(year),
          this.f1Service.getConstructorStandings(year),
        ]);
        this.raceResults.set(results);
        this.qualifyingResults.set(qualy);
        this.driverStandings.set(drivers);
        this.constructorStandings.set(constructors);
      }
    }
  }

  setTab(tabId: string): void {
    this.activeTab.set(tabId as Tab);
  }

  toggleFavorite(): void {
    this.favoritesService.toggle(this.raceId());
  }

  getSessionDisplay(session: { date: string; time: string; name: string }) {
    return this.timeService.getSessionDisplay(session.date, session.time, session.name);
  }

  formatTime(time: string): string {
    return time || '--:--';
  }
}