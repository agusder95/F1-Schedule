import { Injectable, signal, computed } from '@angular/core';

const STORAGE_KEY = 'sector-tres-favorites';

export interface FavoritesState {
  raceIds: string[];
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  readonly raceIds = signal<Set<string>>(this.loadFromStorage());
  readonly favorites = computed(() => this.raceIds());

  private loadFromStorage(): Set<string> {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set();
    try {
      const data: FavoritesState = JSON.parse(stored);
      return new Set(data.raceIds);
    } catch {
      return new Set();
    }
  }

  private saveToStorage(): void {
    const data: FavoritesState = {
      raceIds: Array.from(this.raceIds()),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  toggle(raceId: string): void {
    const current = new Set(this.raceIds());
    if (current.has(raceId)) {
      current.delete(raceId);
    } else {
      current.add(raceId);
    }
    this.raceIds.set(current);
    this.saveToStorage();
  }

  isFavorite(raceId: string): boolean {
    return this.raceIds().has(raceId);
  }

  addAll(raceIds: string[]): void {
    const current = new Set(this.raceIds());
    raceIds.forEach((id) => current.add(id));
    this.raceIds.set(current);
    this.saveToStorage();
  }

  removeAll(raceIds: string[]): void {
    const current = new Set(this.raceIds());
    raceIds.forEach((id) => current.delete(id));
    this.raceIds.set(current);
    this.saveToStorage();
  }

  clear(): void {
    this.raceIds.set(new Set());
    localStorage.removeItem(STORAGE_KEY);
  }

  addNotRaced(raceIds: string[]): void {
    this.addAll(raceIds);
  }

  removeRaced(raceIds: string[]): void {
    this.removeAll(raceIds);
  }
}