import { Injectable, signal, computed } from '@angular/core';

export type Timezone = string;

interface SessionDisplay {
  date: string;
  time: string;
  displayLabel: string;
  displayNote?: string;
}

const STORAGE_KEY = 'sector-tres-timezone';

@Injectable({ providedIn: 'root' })
export class TimeService {
  readonly timezone = signal<Timezone>(this.getStoredTimezone());
  readonly timezoneOptions = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/Argentina/Buenos_Aires', label: 'Argentina (GMT-3)' },
    { value: 'Europe/London', label: 'UK (GMT+0)' },
    { value: 'Europe/Madrid', label: 'España (GMT+1)' },
    { value: 'Europe/Paris', label: 'Francia (GMT+1)' },
    { value: 'America/New_York', label: 'USA East (GMT-5)' },
    { value: 'America/Los_Angeles', label: 'USA West (GMT-8)' },
    { value: 'Asia/Tokyo', label: 'Japón (GMT+9)' },
    { value: 'Asia/Dubai', label: 'Dubai (GMT+4)' },
  ];

  private getStoredTimezone(): Timezone {
    return localStorage.getItem(STORAGE_KEY) ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  setTimezone(tz: Timezone): void {
    this.timezone.set(tz);
    localStorage.setItem(STORAGE_KEY, tz);
  }

  formatDateTime(utcDate: string, utcTime: string): string {
    if (!utcDate) return '';
    const dateTime = this.parseUtc(utcDate, utcTime || '00:00');
    return new Intl.DateTimeFormat(this.timezone(), {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(dateTime);
  }

  formatDate(utcDate: string): string {
    if (!utcDate) return '';
    const dateTime = this.parseUtc(utcDate, '00:00');
    return new Intl.DateTimeFormat(this.timezone(), {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(dateTime);
  }

  formatCompact(utcDate: string, utcTime: string): string {
    if (!utcDate) return '';
    const dateTime = this.parseUtc(utcDate, utcTime || '00:00');
    return new Intl.DateTimeFormat(this.timezone(), {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(dateTime);
  }

  getSessionDisplay(utcDate: string, utcTime: string, sessionName: string): SessionDisplay {
    const dateTime = this.parseUtc(utcDate, utcTime || '00:00');
    const hour = dateTime.getHours();

    const baseLabel = this.formatSessionName(sessionName);
    const hourStr = dateTime.toLocaleTimeString(this.timezone(), {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    if (hour >= 0 && hour < 4.5) {
      const prevDay = new Date(dateTime);
      prevDay.setDate(prevDay.getDate() - 1);
      const dayName = new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(prevDay);
      return {
        date: utcDate,
        time: utcTime,
        displayLabel: `Noche del ${dayName}`,
        displayNote: `${baseLabel} - ${hourStr}`,
      };
    }

    return {
      date: utcDate,
      time: utcTime,
      displayLabel: baseLabel,
      displayNote: hourStr,
    };
  }

  private parseUtc(dateStr: string, timeStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);
    return new Date(Date.UTC(year, month - 1, day, hours, minutes));
  }

  private formatSessionName(name: string): string {
    const names: Record<string, string> = {
      FirstPractice: 'FP1',
      SecondPractice: 'FP2',
      ThirdPractice: 'FP3',
      Qualifying: 'Qualy',
      Race: 'Carrera',
      Sprint: 'Sprint',
      Shootout: 'Shootout',
    };
    return names[name] || name;
  }

  isPast(utcDate: string, utcTime: string): boolean {
    const dateTime = this.parseUtc(utcDate, utcTime || '00:00');
    return dateTime.getTime() < Date.now();
  }

  isCurrent(utcDate: string, utcTime: string): boolean {
    const raceTime = this.parseUtc(utcDate, utcTime || '00:00').getTime();
    const now = Date.now();
    return raceTime <= now && raceTime + 7200000 > now;
  }
}