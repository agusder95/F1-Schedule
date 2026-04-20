# Development Rules

## Coding Standards
- Usar **PascalCase** para componentes y **camelCase** para variables/funciones.
- Todos los componentes deben ser `standalone: true`.
- Prohibido el uso de `any`; definir interfaces para todas las respuestas de la API.
- Usar `async/await` para el manejo de las promesas del `fetch`.

## Tailwind Rules
- No usar estilos en archivos CSS/SCSS a menos que sea estrictamente necesario.
- Mantener el orden de clases de Tailwind: Layout -> Box Model -> Typography -> Effects.


## UI & Styling
- **Design System:** Mobile-first absoluto. No usar tablas nativas, usar Flex/Grid para las grillas de tiempos.
- **Theming:**
    - Variables CSS: `--team-color`, `--podium-gold`, `--podium-silver`, `--podium-bronze`.
    - Dark mode debe usar el color F1 Carbon como fondo principal.
- **Time Formatting:** Si una sesión ocurre pasadas las 00:00, mostrar una nota aclaratoria o formato 24h claro para evitar confusión de día.

## Angular Standards
- Componentes 100% Standalone.
- Uso de `computed()` signals para filtrar temporadas y favoritos.
- Los iconos y logos de escuderías deben cargarse de forma lazy o mediante un servicio de assets dedicado.
- Limpiar suscripciones o usar `toSignal` para evitar fugas de memoria.

# Agent Interaction Protocol

1. **Strict Consultation:** Ante cualquier duda sobre la implementación, falta de datos en la API o ambigüedad estética, DETENER la generación y preguntar al usuario.
2. **No Hallucinations:** Está estrictamente prohibido inventar variables, rutas de archivos o lógica de negocio que no esté explícitamente en la `spec.md` o `tech_spec.md`.
3. **Validation First:** Antes de escribir un archivo, el agente debe confirmar que entiende la relación de ese archivo con las capas de la arquitectura definidas.