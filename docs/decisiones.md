# Registro de decisiones

## D-001 — La construcción existente es la referencia principal

- **Fecha:** 2026-07-18
- **Estado:** Aprobada por consigna inicial
- **Decisión:** Modelar lo observado y evitar un rediseño desde cero.
- **Motivo:** Preservar el valor artesanal y asegurar que futuras ampliaciones reutilicen la estructura real.
- **Consecuencia:** Toda propuesta nueva se identifica como futura y puede ocultarse en el visor.

## D-002 — No ocultar la contradicción dimensional

- **Fecha:** 2026-07-18
- **Estado:** Superada por D-006; se conserva como antecedente
- **Decisión:** Conservar 60 cm, 21 cm, 60 cm y 119 cm como valores informados, aunque no sean compatibles entre sí.
- **Motivo:** Evitar presentar una corrección inventada como medida real.
- **Consecuencia histórica:** La primera implantación 3D usó anchos estimados de 47 cm, 21 cm y 47 cm. Esa interpretación fue descartada al confirmarse el giro de 90°.

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

## D-006 — Implantación en L con torre azul girada

- **Fecha:** 2026-07-18
- **Estado:** Parcialmente superada por D-007; tamaño y forma en L conservados
- **Decisión histórica:** Modelar ambas cajas con dimensiones locales 60 × 38 × 113 cm y girar la torre azul 90° sobre el eje vertical. La primera interpretación orientó erróneamente la abertura hacia el núcleo.
- **Motivo:** Corresponde a la construcción real y explica la base de 119 cm: 60 cm de la torre violeta + 21 cm del núcleo + 38 cm de profundidad de la torre girada.
- **Consecuencia:** Se eliminan los anchos visuales estimados de 47 cm. Los puentes quedan como piezas independientes de 21 cm de luz y profundidad provisional de 12 cm.

## D-007 — Frente azul común y pared de puentes cerrada

- **Fecha:** 2026-07-18
- **Estado:** Confirmada por el usuario y fotos 004–005
- **Decisión:** Invertir el sentido del giro de la torre azul. El frente grande queda abierto hacia el mismo frente visual que la torre violeta; la cara que mira al núcleo se mantiene cerrada y solo tiene dos aberturas pequeñas alineadas con los puentes.
- **Motivo:** La vista frontal muestra el gran vano azul abierto, mientras el puente llega a una pared lateral continua.
- **Consecuencia:** El modelo usa un giro de +90°, abre la cara frontal resultante, cierra la cara exterior y divide la pared de conexión en cinco paños alrededor de dos huecos provisionales de 12 cm de ancho. Las dimensiones de esos huecos deben medirse.

## D-008 — Alineación posterior y huecos en ambas torres

- **Fecha:** 2026-07-18
- **Estado:** Confirmada por el usuario
- **Decisión:** Alinear las caras posteriores de las dos cajas en Z = −30 cm, no sus frentes. Reconstruir la pared lateral derecha de la torre violeta con dos aberturas pequeñas alineadas con los puentes.
- **Motivo:** Ambas cajas apoyan contra la misma pared posterior. La diferencia de profundidad debe verse hacia el frente y los puentes atraviesan huecos en las dos cajas.
- **Consecuencia:** El centro de la torre violeta pasa de Z = 10 a Z = −11 cm. Su frente queda en Z = 8 cm y el frente azul en Z = 30 cm, generando un saliente de 22 cm. Cada pared de conexión se divide en cinco paños alrededor de dos aberturas provisionales.

## D-009 — Tres estados claramente separados

- **Fecha:** 2026-07-22
- **Estado:** Activa
- **Decisión:** Separar en el JSON y el visor la estructura construida, los materiales disponibles sin instalar y las ampliaciones futuras.
- **Motivo:** Evitar que una pieza de inventario o una idea se confunda con la casa real.
- **Consecuencia:** Las capas `available` y `future` están apagadas por defecto y tienen controles independientes.

## D-010 — Canaletas abiertas para el tobogán

- **Fecha:** 2026-07-22
- **Estado:** Confirmada por el usuario
- **Decisión:** Representar las dos canaletas como perfiles U abiertos, con base y laterales de 6 cm; nunca como tubos cerrados.
- **Motivo:** Corresponde al material disponible real.
- **Consecuencia:** El recorrido del tobogán sigue siendo conceptual. El espesor visual del visor no se considera una medida física.

## D-011 — Conservar enteras las tapas resistentes

- **Fecha:** 2026-07-22
- **Estado:** Activa
- **Decisión:** Priorizar usos que aprovechen completas las dos tapas de cartón de 116 × 38 × 3 cm aproximadamente.
- **Motivo:** Son piezas grandes, resistentes y difíciles de reemplazar.
- **Consecuencia:** No se asignan cortes hasta aprobar una solución que realmente los necesite.

## D-012 — Piscina prioritaria y módulos laterales independientes

- **Fecha:** 2026-07-22
- **Estado:** Conceptual
- **Decisión:** Dar prioridad alta a una piscina plástica de aproximadamente 30 × 20 cm con patio de pasto artificial. Modelar dos muebles laterales MDF como marcadores sin dimensiones y estructuralmente independientes.
- **Motivo:** Permite ampliar el proyecto sin transferir cargas nuevas a las cajas de cartón.
- **Consecuencia:** La piscina y los módulos se muestran solo en la capa futura; la compra y las dimensiones finales quedan pendientes.

## D-013 — Corrección del espesor de la base

- **Fecha:** 2026-07-22
- **Estado:** Activa
- **Decisión:** Registrar la base existente como MDF de 119 × 58 × 0,3 cm.
- **Motivo:** Nueva medida informada por el usuario.
- **Consecuencia:** El valor anterior de 1,5 cm se conserva como antecedente superado y la geometría visible usa 3 mm.

## D-014 — Mueble 1 y Mueble 2 son ampliaciones de la casa

- **Fecha:** 2026-07-22
- **Estado:** Conceptual, solicitada por el usuario
- **Decisión:** Reemplazar los marcadores laterales genéricos por dos casas-mueble más altas que la estructura de cartón: Mueble 1 de 177 cm y Mueble 2 de 166 cm.
- **Motivo:** Las alturas aprovechan enteras las placas largas disponibles y amplían el proyecto como conjunto arquitectónico.
- **Consecuencia:** Cada mueble usa dos laterales largos, tres placas de 50,3 cm, una tapa de cartón entera y una placa fina de 61 cm. Ambos se apoyan y estabilizan de forma independiente para no cargar el cartón.

## D-015 — Distribución inicial de usos

- **Fecha:** 2026-07-22
- **Estado:** Propuesta para evaluar
- **Decisión:** Reservar el nivel de 113 cm como vínculo arquitectónico con la casa actual. Proponer garaje/guardado y habitación para Mueble 1; piscina/vestuario y habitaciones para Mueble 2; usar los niveles superiores para terraza, jardín alto, observatorio o salida de tobogán.
- **Motivo:** Crea continuidad con la casa existente y aprovecha la nueva altura sin modificarla.
- **Consecuencia:** Los usos pueden cambiar; las posiciones de pisos sí responden al material disponible y deben validarse antes de cortar o perforar.
