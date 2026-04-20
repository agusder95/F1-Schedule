export interface Session {
  name: string;
  date: string;
  time: string;
}

export interface Race {
  id: string;
  name: string;
  status: 'passed' | 'current' | 'upcoming';
  circuit2d: string;
  circuitIcon: string;
  country: string;
  city: string;
  date: string;
  sessions: Session[];
}

export interface Result {
  pos: number;
  driverName: string;
  driverNumber: string;
  teamColor: string;
  teamLogo: string;
  time: string;
  points: number;
  fastLap: boolean;
}

export interface Standings {
  pos: number;
  entityName: string;
  points: number;
  isTopThree: boolean;
}