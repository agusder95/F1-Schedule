# Technical Specification: SectorTres

## Stack
- **Framework:** Angular 21 (Standalone Components).
- **Reactividad:** Signals para Favoritos, Tema y Zona Horaria.
- **Data:** Native Fetch API.
- **Storage:** LocalStorage (Theme, Timezone, Favorites).

## Data Architecture
- **ThemeService:** Gestiona clase `.dark` en el body y persiste preferencia.
- **TimeService:** Lógica personalizada para evitar confusión en madrugadas (ej: Sábado 02:00 am visualizado como noche del viernes).
- **F1DataService:** Mapeo de IDs de API a colores de equipo y URLs de logos/circuitos.

## Models (Interfaces)
- `Race`: id, name, status, circuit2d, circuitIcon, country, city, date, sessions[].
- `Result`: pos, driverName, driverNumber, teamColor, teamLogo, time, points, fastLap(boolean).
- `Standings`: pos, entityName, points, isTopThree(boolean).