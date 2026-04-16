# Benchmarks de Rendimiento Next.js

Para optimizar la **Carga Inicial (LCP)** y el **JS Size**, el Agente debe validar:

1. **Images**: Uso estricto de `next/image` con prioridades.
2. **Fonts**: Uso de `next/font` para evitar layout shifts.
3. **Scripts**: Carga de terceros con `next/script` y estrategia `afterInteractive`.
4. **State Management**: Evitar Context Providers globales que envuelvan toda la aplicación si solo se usan en hojas del árbol.
