import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'race/:year/:round',
        loadComponent: () => import('./features/race-detail/race-detail.component').then((m) => m.RaceDetailComponent),
      },
      {
        path: 'standings',
        loadComponent: () => import('./features/standings/standings.component').then((m) => m.StandingsComponent),
      },
      {
        path: 'favorites',
        loadComponent: () => import('./features/favorites/favorites.component').then((m) => m.FavoritesComponent),
      },
    ],
  },
];