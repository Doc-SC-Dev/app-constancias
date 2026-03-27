---
name: frontend-audit
description: Auditoría profunda de React/Next.js enfocada en SOLID, Clean Architecture y optimización de Web Vitals (LCP, Bundle Size).
disable-model-invocation: true
---

# Frontend Architecture & Performance Audit

## When to Use

- Al finalizar una funcionalidad o componente complejo.
- Cuando se detecten problemas de rendimiento o archivos con demasiadas responsabilidades (God Components).
- Al escribir `/frontend-audit` en el chat de Cursor.

## Instructions

1. **Análisis Arquitectónico**: Evalúa el cumplimiento de **SOLID** (especialmente SRP y DIP) y **Clean Architecture**. Verifica si la lógica de negocio está acoplada a la UI.
2. **Principios DRY**: Identifica patrones repetitivos que puedan abstraerse en Custom Hooks o componentes atómicos.
3. **Performance (KPI Focus)**:
   - **Carga Inicial**: Identifica componentes que no usan `next/dynamic` para Code Splitting.
   - **JS Bundle**: Busca dependencias pesadas que se cargan en el cliente innecesariamente.
   - **React Best Practices**: Verifica el uso correcto de `useMemo`, `useCallback` y la prevención de re-renders innecesarios.
4. **Ejecución de Diagnóstico**: Antes de dar recomendaciones, ejecuta el script de análisis de dependencias: `node .cursor/skills/frontend-audit/scripts/analyze-bundle.js`.
5. **Output**: Proporciona un reporte dividido en:
   - 🔴 **Crítico**: Violaciones de arquitectura o fugas de rendimiento graves.
   - 🟡 **Mejora**: Sugerencias de refactorización DRY/SOLID.
   - 🟢 **Optimización**: Tips específicos para mejorar el TTI (Time to Interactive).

## Constraints

- No sugieras librerías externas si el problema se puede resolver con APIs nativas de React o Next.js.
- Prioriza siempre Server Components (`app/` directory) sobre Client Components.
