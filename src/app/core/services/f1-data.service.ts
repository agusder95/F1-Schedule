import { Injectable, signal, computed } from '@angular/core';
import { Race, Result, Standings, Session } from '../models/f1.models';
import { getTeamBranding, TeamAsset } from '../constants/team-assets';

const API_BASE = 'https://api.jolpi.ca/ergast/f1'

interface JolpicaRace {
  season: string;
  round: string;
  raceName: string;
  date: string;
  time: string;
  raceUrl: string;
  Circuit: {
    circuitId: string;
    circuitUrl: string;
    circuitName: string;
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
  };
  FirstPractice?: { date: string; time: string };
  SecondPractice?: { date: string; time: string };
  ThirdPractice?: { date: string; time: string };
  Qualifying?: { date: string; time: string };
  Sprint?: { date: string; time: string };
  SprintQualifying?: { date: string; time: string };
  Shootout?: { date: string; time: string };
}

interface JolpicaDriverResult {
  number: string;
  position: string;
  positionText: string;
  positionOrder: string;
  points: string;
  laps: string;
  status: string;
  grid: string;
  FastestLap?: {
    lap: string;
    Time?: { time: string };
    AverageSpeed?: { speed: string; units: string };
  };
  Driver: {
    driverId: string;
    permanentNumber: string;
    code: string;
    givenName: string;
    familyName: string;
    dateOfBirth: string;
    nationality: string;
    url: string;
  };
  Constructor: {
    constructorId: string;
    name: string;
    nationality: string;
    url: string;
  };
  Time?: { time: string; millis: string };
}

interface JolpicaQualifyingResult {
  number: string;
  position: string;
  q1: string;
  q2?: string;
  q3?: string;
  Driver: {
    driverId: string;
    permanentNumber: string;
    code: string;
    givenName: string;
    familyName: string;
    dateOfBirth: string;
    nationality: string;
    url: string;
  };
  Constructor: {
    constructorId: string;
    name: string;
    nationality: string;
    url: string;
  };
}

interface JolpicaStandings {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver?: {
    driverId: string;
    code: string;
    givenName: string;
    familyName: string;
    nationality: string;
    url: string;
  };
  Constructor?: {
    constructorId: string;
    name: string;
    nationality: string;
    url: string;
  };
}

interface JolpicaMrData<T> {
  MRData: {
    total: string;
    RaceTable: {
      season: string;
      round: string;
      Races: T[];
    };
  };
}

interface JolpicaStandingsMrData<T> {
  MRData: {
    StandingsTable: {
      StandingsLists: {
        season: string;
        round: string;
        DriverStandings?: T[];
        ConstructorStandings?: T[];
      }[];
    };
  };
}

@Injectable({ providedIn: 'root' })
export class F1DataService {
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  async getSeasonSchedule(year: number): Promise<Race[]> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const res = await fetch(`${API_BASE}/${year}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: JolpicaMrData<JolpicaRace> = await res.json();

      const races: Race[] = data.MRData.RaceTable.Races.map((r, idx) => {
        const raceDate = r.date;
        const raceTime = r.time || '00:00';

        const sessions: Session[] = [];
        if (r.FirstPractice) sessions.push({ name: 'FirstPractice', ...r.FirstPractice });
        if (r.SprintQualifying) sessions.push({ name: 'SprintQualifying', ...r.SprintQualifying });
        if (r.Sprint) sessions.push({ name: 'Sprint', ...r.Sprint });
        if (r.Qualifying) sessions.push({ name: 'Qualifying', ...r.Qualifying });
        if (r.SecondPractice) sessions.push({ name: 'SecondPractice', ...r.SecondPractice });
        if (r.ThirdPractice) sessions.push({ name: 'ThirdPractice', ...r.ThirdPractice });
        if (r.Shootout) sessions.push({ name: 'Shootout', ...r.Shootout });
        sessions.push({ name: 'Race', date: raceDate, time: raceTime });

        const now = new Date();
        const raceDateTime = new Date(`${raceDate}T${raceTime}Z`);
        const twoHoursAgo = new Date(now.getTime() - 7200000);
        const twoHoursAhead = new Date(now.getTime() + 7200000);

        let status: 'passed' | 'current' | 'upcoming' = 'upcoming';
        if (raceDateTime < twoHoursAgo) status = 'passed';
        else if (raceDateTime >= twoHoursAgo && raceDateTime <= twoHoursAhead) status = 'current';

        return {
          id: `${year}-${r.round}`,
          name: r.raceName,
          status,
          circuit2d: `https://media.formula1.com/image/private/fom-website/legacy/0.0.0.0x0/sites/f1/files/${r.Circuit.circuitId}_map.png`,
          circuitIcon: r.Circuit.circuitUrl,
          country: r.Circuit.Location.country,
          city: r.Circuit.Location.locality,
          date: raceDate,
          sessions,
        };
      });

      this.loading.set(false);
      return races;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      this.error.set(msg);
      this.loading.set(false);
      return [];
    }
  }

  async getRaceResults(year: number, round: number): Promise<Result[]> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const res = await fetch(`${API_BASE}/${year}/${round}/results.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: JolpicaMrData<{ Results: JolpicaDriverResult[] }> = await res.json();

      const results: Result[] = data.MRData.RaceTable.Races[0]?.Results.map((r) => {
        const branding = getTeamBranding(r.Constructor.constructorId);
        const driverName = `${r.Driver.givenName} ${r.Driver.familyName}`;

        return {
          pos: parseInt(r.position) || 0,
          driverName,
          driverNumber: r.Driver.permanentNumber || r.number,
          teamColor: branding.color,
          teamLogo: branding.logoUrl,
          time: r.Time?.time || r.status,
          points: parseFloat(r.points) || 0,
          fastLap: !!r.FastestLap,
        };
      }) || [];

      this.loading.set(false);
      return results;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      this.error.set(msg);
      this.loading.set(false);
      return [];
    }
  }

  async getQualifyingResults(year: number, round: number): Promise<Result[]> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const res = await fetch(`${API_BASE}/${year}/${round}/qualifying.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: JolpicaMrData<{ QualifyingResults: JolpicaQualifyingResult[] }> = await res.json();

      const results: Result[] = data.MRData.RaceTable.Races[0]?.QualifyingResults.map((r) => {
        const branding = getTeamBranding(r.Constructor.constructorId);
        const driverName = `${r.Driver.givenName} ${r.Driver.familyName}`;

        return {
          pos: parseInt(r.position) || 0,
          driverName,
          driverNumber: r.Driver.permanentNumber || r.number,
          teamColor: branding.color,
          teamLogo: branding.logoUrl,
          time: r.q3 || r.q2 || r.q1,
          points: 0,
          fastLap: false,
        };
      }) || [];

      this.loading.set(false);
      return results;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      this.error.set(msg);
      this.loading.set(false);
      return [];
    }
  }

  async getDriverStandings(year: number): Promise<Standings[]> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const res = await fetch(`${API_BASE}/${year}/driverStandings.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: JolpicaStandingsMrData<JolpicaStandings> = await res.json();

      const standingsList = data.MRData.StandingsTable?.StandingsLists?.[0];
      const driverStandings = standingsList?.DriverStandings || [];
      const standings = driverStandings.map((s) => {
        const driver = s.Driver!;
        return {
          pos: parseInt(s.position) || 0,
          entityName: `${driver.givenName} ${driver.familyName}`,
          points: parseFloat(s.points) || 0,
          isTopThree: parseInt(s.position) <= 3,
        };
      }) || [];

      this.loading.set(false);
      return standings;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      this.error.set(msg);
      this.loading.set(false);
      return [];
    }
  }

  async getConstructorStandings(year: number): Promise<Standings[]> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const res = await fetch(`${API_BASE}/${year}/constructorStandings.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: JolpicaStandingsMrData<JolpicaStandings> = await res.json();

      const standingsList = data.MRData.StandingsTable?.StandingsLists?.[0];
      const constructorStandings = standingsList?.ConstructorStandings || [];
      const standings = constructorStandings.map((s) => {
        const branding = getTeamBranding(s.Constructor!.constructorId);
        return {
          pos: parseInt(s.position) || 0,
          entityName: s.Constructor!.name,
          points: parseFloat(s.points) || 0,
          isTopThree: parseInt(s.position) <= 3,
        };
      }) || [];

      this.loading.set(false);
      return standings;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      this.error.set(msg);
      this.loading.set(false);
      return [];
    }
  }
}
