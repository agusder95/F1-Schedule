export interface TeamAsset {
  color: string;
  logoUrl: string;
}

export const TEAM_ASSETS: Record<string, TeamAsset> = {
  red_bull: {
    color: '#3671C6',
    logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2024/red-bull-racing.png',
  },
  mercedes: {
    color: '#27F4D2',
    logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2024/mercedes.png',
  },
  ferrari: {
    color: '#E0645A',
    logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2024/ferrari.png',
  },
  mclaren: {
    color: '#FF8000',
    logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2024/mclaren.png',
  },
  aston_martin: {
    color: '#229971',
    logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2024/aston-martin.png',
  },
  alpine: {
    color: '#0093CC',
    logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2024/alpine.png',
  },
  williams: {
    color: '#64C4FF',
    logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2024/williams.png',
  },
  haas: {
    color: '#B6BABD',
    logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2024/haas.png',
  },
  rb: {
    color: '#6692FF',
    logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2024/rb.png',
  },
  sauber: {
    color: '#52E252',
    logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2024/kick-sauber.png',
  },
  audi: {
    color: '#F10702',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo.svg',
  },
  alphatauri: {
    color: '#5E8FAA',
    logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2023/alpha-tauri.png',
  },
  alfa: {
    color: '#900000',
    logoUrl: 'https://media.formula1.com/content/dam/fom-website/teams/2023/alfa-romeo.png',
  },
};

const FALLBACK_TEAM: TeamAsset = {
  color: '#FF1801',
  logoUrl: '',
};

export function getTeamBranding(constructorId: string): TeamAsset {
  const normalized = constructorId.toLowerCase().replace(/[-_\s]/g, '_');
  return TEAM_ASSETS[normalized] ?? FALLBACK_TEAM;
}