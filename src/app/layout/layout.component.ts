import { Component, signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ThemeService } from '../core/services/theme.service';
import { FavoritesService } from '../core/services/favorites.service';
import { TimeService } from '../core/services/time.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, NgClass, RouterOutlet, RouterLink],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  readonly sidebarOpen = signal(false);

  constructor(
    public themeService: ThemeService,
    public favoritesService: FavoritesService,
    public timeService: TimeService
  ) {}

  onTimezoneChange(event: Event): void {
    const tz = (event.target as HTMLSelectElement).value;
    this.timeService.setTimezone(tz);
  }

  clearAllData(): void {
    localStorage.clear();
    this.favoritesService.clear();
    this.themeService.theme.set('dark');
    this.timeService.setTimezone('UTC');
    window.location.reload();
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}