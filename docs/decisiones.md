# Registro de decisiones

## D-001 — La construcción existente es la referencia principal

- **Fecha:** 2026-07-18
- **Estado:** Aprobada por consigna inicial
- **Decisión:** Modelar lo observado y evitar un rediseño desde cero.
- **Motivo:** Preservar el valor artesanal y asegurar que futuras ampliaciones reutilicen la estructura real.
- **Consecuencia:** Toda propuesta nueva se identifica como futura y puede ocultarse en el visor.

## D-002 — No ocultar la contradicción dimensional

- **Fecha:** 2026-07-18
- **Estado:** Provisional hasta medición física
- **Decisión:** Conservar 60 cm, 21 cm, 60 cm y 119 cm como valores informados, aunque no sean compatibles entre sí.
- **Motivo:** Evitar presentar una corrección inventada como medida real.
- **Consecuencia:** La implantación 3D usa anchos estimados de 47 cm, 21 cm y 47 cm sobre la base de 119 cm, con 2 cm de margen por lado. Estos anchos sirven solo para visualizar y deberán reemplazarse al medir.

## D-003 — Un único origen geométrico

- **Fecha:** 2026-07-18
- **Estado:** Activa
- **Decisión:** Usar centímetros, eje X horizontal, Y vertical y Z de frente hacia fondo; el origen está en el centro de la base a nivel de su cara superior.
- **Motivo:** Facilitar cálculos, cotas y futuras actualizaciones.

## D-004 — Modelo impulsado por datos

- **Fecha:** 2026-07-18
- **Estado:** Activa
- **Decisión:** El visor no contiene medidas específicas de la casa; genera escenas desde `model/casa.json`.
- **Motivo:** Mantener consistencia y permitir que las actualizaciones futuras se concentren en una sola fuente geométrica.

## D-005 — Ampliaciones reversibles

- **Fecha:** 2026-07-18
- **Estado:** Conceptual
- **Decisión:** Ascensor, tobogán, escaleras y LED se modelan como alternativas ocultas por defecto.
- **Motivo:** Evaluarlas sin alterar ni confundir el estado construido.

