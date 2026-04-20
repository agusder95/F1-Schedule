---
id: sector-tres-spec
type: product_spec
version: 1.0.0
---

# Product Specification: SectorTres
## Overview
SectorTres es un dashboard de F1 minimalista y mobile-first que ofrece telemetría visual de carreras, calendarios y posiciones, con personalización avanzada por zona horaria y escuderías.

## Core Features & Logic
1. **Home:** Cards de carreras filtrables por temporada.
2. **Race Cards:**
    - Visual: Imagen 2D del circuito + Nombre + Horario.
    - Status: Badge dinámico (Terminado/Actual/Próximo) con colores F1.
3. **Detalle de Carrera (Vistas por Estado):**
    - **Pasada:** Podio visual, pestaña Grilla/Tiempos (con puntos), pestaña Qualy (tiempos Q1/Q2/Q3), pestaña Puntos de Piloto (con links a campeonatos).
    - **Próxima:** Cronograma completo del GP, Podio de la temporada anterior para contexto.
    - **Actual:** Pestaña Horarios (con check de completado), pestaña Qualy (en vivo), pestañas Práctica.
4. **Información de Campeonatos:**
    - Top 3 con colores Oro, Plata y Bronce. Resto con color de escudería.
    - Footer: Cálculo de puntos y carreras restantes en la temporada.
5. **Gestión de Favoritos:**
    - Filtros masivos: "Agregar no corridos", "Eliminar ya corridos", "Quitar todos".
6. **Configuración (Menú Hamburguesa):**
    - Selector Tema: Dark / Light (Default). Persistido en LocalStorage.
    - Selector Zona Horaria: Listado de países principales.
    - Danger Zone: Botón "Borrar todos los datos" (Clear LocalStorage).

## Aesthetics & UI
- **Estilo:** Minimalismo extremo, "Mobile-First", look de telemetría.
- **Branding:** Base F1 Carbon (#15151E) y F1 Red (#FF1801).
- **Detalles:** Imagen 2D del trazado + imagen icónica de fondo.
- **Identidad:** Uso de logos de escudería, números de piloto y colores dinámicos en cada fila/grilla.

# Technical Specification: SectorThree

## Technology Stack
- **Framework:** Angular 21 (Strict Mode, Standalone Components).
- **Styling:** Tailwind CSS 3.4+ (PostCSS).
- **Data Fetching:** Native Fetch API (dentro de servicios de Angular).
- **State Management:** Angular Signals (para reactividad y favoritos).

## Architecture: Layered Pattern
1. **Core Layer:** Servicios globales, interfaces (modelos) y utilidades de fecha (Timezones).
2. **Features Layer:** Componentes de página (RaceList, RaceDetail, Standings, Favorites).
3. **Shared Layer:** Componentes reutilizables (Cards, Navbar, Loading Spinner).

## Data Models (Interfaces)
- `Race`: Id, name, date, time, circuit, status.
- `RaceResult`: Position, driver, team, time/status.
- `Standing`: Position, name, points, team.