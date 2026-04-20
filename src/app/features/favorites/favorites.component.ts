import { Component, signal, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { F1DataService } from '../../core/services/f1-data.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { Race } from '../../core/models/f1.models';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent implements OnInit {
  private f1Service = inject(F1DataService);
  private favoritesService = inject(FavoritesService);

  readonly races = signal<Race[]>([]);
  readonly loading = signal(false);

  constructor() {
    effect(() => {
      const favs = this.favoritesService.favorites();
      this.loadFavorites(favs);
    });
  }

  async ngOnInit(): Promise<void> {
    const favs = this.favoritesService.favorites();
    await this.loadFavorites(favs);
  }

  private async loadFavorites(favs: Set<string>): Promise<void> {
    this.loading.set(true);
    const currentYear = new Date().getFullYear();
    const allRaces: Race[] = [];

    for (const raceId of favs) {
      const [year, round] = raceId.split('-').map(Number);
      if (year === currentYear) {
        const schedule = await this.f1Service.getSeasonSchedule(year);
        const race = schedule.find((r) => r.id === raceId);
        if (race) allRaces.push(race);
      }
    }

    this.races.set(allRaces);
    this.loading.set(false);
  }

  removeFavorite(raceId: string): void {
    this.favoritesService.toggle(raceId);
    const updated = this.races().filter((r) => r.id !== raceId);
    this.races.set(updated);
  }

  clearAll(): void {
    this.favoritesService.clear();
    this.races.set([]);
  }
}