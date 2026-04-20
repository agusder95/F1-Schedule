# Implementation Plan: SectorThree

## Fase 1: Setup & Theme
- [ ] 1.1. Iniciar proyecto Angular 21 + Tailwind.
- [ ] 1.2. Implementar `ThemeService` (Dark/Light) con LocalStorage.
- [ ] 1.3. Crear Layout base con Menú Hamburguesa y Sidebar de configuración.

## Fase 2: Data Layer & Timezone
- [ ] 2.1. Crear `F1ApiService` con mapeo de colores y logos de escuderías.
- [ ] 2.2. Implementar lógica de `TimeService` para conversión de horarios por país.
- [ ] 2.3. Configurar mocks de datos para estados: Pasada, Actual, Próxima.

## Fase 3: UI - Home & Cards
- [ ] 3.1. Diseñar la Card minimalista (Imagen 2D, estatus, horarios).
- [ ] 3.2. Implementar filtro de temporadas en la Home.

## Fase 4: Detalle de Carrera & Grillas
- [ ] 4.1. Crear vista de pestañas dinámica según el estado del GP.
- [ ] 4.2. Implementar Podio visual y tablas de tiempos con variables dinámicas de color.
- [ ] 4.3. Implementar lógica de Favoritos (CRUD y filtros masivos).

## Fase 5: Standings & Final Polish
- [ ] 5.1. Pantalla de Campeonatos con medallas Oro/Plata/Bronce.
- [ ] 5.2. Lógica de "Puntos restantes en la temporada".
- [ ] 5.3. Botón de "Borrar todo" y ajustes finales de UX.