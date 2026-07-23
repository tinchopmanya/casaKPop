# Casa de Muñecas Modular

Plano maestro vivo de una casa de muñecas artesanal construida con dos cajas grandes de cartón, un núcleo central de conexión y una base de MDF.

Este repositorio conserva el estado real de la construcción, las fotografías de referencia, todas las medidas conocidas, las decisiones de diseño y un modelo 3D navegable. La regla principal es **reutilizar lo construido antes de proponer cambios estructurales**.

## Ver el modelo 3D

El visor está publicado desde la carpeta `viewer/` y lee toda la geometría desde `model/casa.json`.

Para abrirlo localmente en Windows:

1. Entrá en la carpeta `viewer`.
2. Hacé doble clic en `ABRIR-VISOR.cmd`.
3. El navegador abrirá automáticamente el modelo 3D.

Para detener el pequeño servidor local, hacé doble clic en `CERRAR-VISOR.cmd`. `index.html` no puede abrirse directamente porque el navegador bloquea la lectura local de `casa.json`.

Controles disponibles:

- Rotar, acercar y desplazar la cámara.
- Cambiar entre perspectiva frontal y vista superior tipo plano.
- Activar o desactivar cada nivel.
- Mostrar medidas, estructura, muebles, material disponible y ampliaciones futuras.
- Abrir una vista de inventario para revisar las placas, tapas y canaletas sin confundirlas con lo construido.
- Restablecer la vista.

## Vistas verificadas

![Vista frontal en perspectiva](assets/renders/modelo-3d-frente.png)

![Vista superior tipo plano](assets/renders/modelo-3d-superior.png)

## Estado inicial

- Torre izquierda violeta, cerrada por laterales y fondo, con tres niveles y fachada decorada.
- Torre derecha azul, girada 90° en planta respecto de la violeta: frente grande abierto hacia el frente común de la casa y pared de conexión cerrada salvo por pequeñas aberturas para los puentes.
- Ambas torres se alinean por la cara posterior que apoya contra la pared; por eso la torre azul sobresale aproximadamente 22 cm hacia el frente.
- La pared lateral derecha de la torre violeta también permanece cerrada salvo por dos aberturas pequeñas para los puentes.
- Núcleo central rosado unido mediante puentes de cartón.
- Base de MDF de 119 × 58 × 0,3 cm.
- Piscina, módulos laterales, ascensor manual, tobogán exterior, escaleras y luces LED registrados como ideas futuras opcionales, apagadas por defecto.
- El tobogán se representa mediante canaletas abiertas en U, no como tubo cerrado.

## Precisión dimensional

Las medidas originales se preservan en `docs/medidas.md` y `model/casa.json`. La orientación en L fue confirmada el 18 de julio de 2026: la torre azul está girada 90°. Así, el ancho de implantación es `60 + 21 + 38 = 119 cm`, coincidente con la base. La profundidad informada de la base (58 cm aprox.) todavía debe verificarse frente a los 60 cm ocupados por la torre girada. La profundidad y posición exacta de los puentes también siguen marcadas como estimadas.

## Estructura

- `docs/`: documentación viva, decisiones, medidas, materiales y tareas.
- `ideas.md`: banco de ideas futuras, con prioridad y restricciones, separado del estado actual.
- `model/`: geometría estructurada e historial de cambios.
- `viewer/`: visor 3D Three.js impulsado únicamente por `casa.json`.
- `assets/photos/`: fotografías originales numeradas, nunca reemplazadas.
- `assets/renders/`: referencias gráficas y futuros renders del modelo.
- `assets/textures/`: texturas futuras.
- `prompts/`: consignas y criterios de actualización del proyecto.
