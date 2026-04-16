---
description: Auditoría exhaustiva de componentes React (JSX/TSX) y dependencias locales para evaluar cumplimiento de principios SOLID, DRY y patrones de React, generando un reporte de hallazgos y recomendaciones sin aplicar cambios.
---

# Context

- **Primary Input**: Archivo React (`.jsx` o `.tsx`) proporcionado por el usuario.
- **Scope**: El componente raíz, sus sub-componentes locales (definidos en el mismo repo) y hooks personalizados asociados.
- **Exclusions**: Librerías externas en `node_modules` (solo identificar su uso, no auditar su código interno).
- **Tooling**: LSP del lenguaje, soporte de tipos de TypeScript y herramientas de análisis estático si están disponibles.

# Trigger

Ejecución manual cuando se requiere validar la arquitectura y mantenibilidad de un componente antes de un refactor o code review.

# Steps

1. **Dependency Mapping**: Identificar y leer todos los archivos de componentes y hooks locales importados por el archivo de entrada.
2. **React Patterns Audit**:
   - Verificar uso correcto de Hooks (Rules of Hooks).
   - Evaluar la gestión de estados (evitar prop drilling excesivo).
   - Revisar la eficiencia de renders (uso de memo, useMemo, useCallback donde aplique).
3. **SOLID & DRY Analysis**:
   - **Single Responsibility**: ¿El componente hace demasiadas cosas (fetching, formateo, renderizado complejo)?
   - **Open/Closed**: ¿Es extensible mediante props o composición sin modificar su código?
   - **DRY**: Identificar lógica duplicada que debería abstraerse en hooks o utilidades.
4. **External Library Check**: Identificar componentes de terceros y verificar si su implementación local respeta la interfaz de la librería.
5. **Report Generation**: Crear un resumen detallado con:
   - Lista de principios violados.
   - Ubicación exacta (línea/archivo).
   - Explicación del "Por qué".
   - **Recomendaciones**: Guía paso a paso de cómo reestructurar el código.

# Verification

- El agente debe confirmar que NO se ha modificado ningún archivo (check de `git status` o timestamps).
- El reporte debe ser entregado en formato Markdown legible en la consola o un archivo `.md` temporal.

# Constraints

- **NO MODIFICAR CÓDIGO**: El agente tiene prohibido usar comandos de escritura (`write`, `sed`, `append`) sobre los archivos fuente.
- **NO ANALIZAR NODE_MODULES**: Si un componente viene de una librería externa, tratarlo como una "caja negra".
- **FOCO EN RECOMENDACIONES**: Las sugerencias deben ser realistas y basadas en el stack tecnológico detectado.
