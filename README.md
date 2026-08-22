# Presentación — Proyecto Final 065-25

Deck web de 15 slides para la defensa del Proyecto Final 065-25 (*Implementación
de ML/IA para la Mejora Integral del Supply Chain en la Industria*, caso Maincal
S.A. / Cronos-N04), de Jerónimo Guaita e Ignacio Ovando.

Es HTML estático: **no tiene build ni dependencias**. Se abre haciendo doble
clic en `index.html` y funciona sin internet, que es el modo previsto para el
día de la defensa.

## Cómo presentar

| Tecla | Acción |
|---|---|
| Flecha derecha / espacio / AvPág | Siguiente slide |
| Flecha izquierda / RePág | Slide anterior |
| `Inicio` / `Fin` | Primera / última slide |
| `f` | Pantalla completa |
| `t` | Alternar tema claro / oscuro |

También se puede navegar con los botones de abajo a la derecha, con swipe en
pantalla táctil, y clickeando la barra de secciones del encabezado (salta a la
primera slide de esa sección). La URL guarda la slide actual (`#slide-7`), así
que se puede abrir directo en cualquier punto.

**Respaldo en papel:** imprimir desde el navegador (Ctrl/Cmd + P, A4 apaisado,
con gráficos de fondo activados) genera un PDF de 15 páginas, una por slide.

## Qué falta completar

Estos puntos están marcados en las slides con un recuadro punteado; no rompen
nada, pero conviene cerrarlos antes de la defensa.

| Pendiente | Dónde | Cómo se completa |
|---|---|---|
| Texto de agradecimiento | Slide 2 | Reemplazar el `<div class="asset-pendiente">` que sigue al título "Agradecimientos" por el texto. Lo escriben los autores. |
| Fotos de los 3 insumos críticos | Slide 8 | No están en el PDF del informe (se revisaron todas las imágenes embebidas: solo hay diagramas y los 3 logos institucionales, ya incorporados). Guardarlas en `assets/insumos/` y reemplazar cada `<div class="asset-pendiente">` por `<img src="assets/insumos/....jpg" alt="...">`. |
| Serie exacta de Prophet (opcional) | Slide 7 | Los valores actuales están leídos de los gráficos del informe (ver "De dónde sale cada dato" abajo), no son el CSV que exporta el notebook. Si quieren esa precisión exacta, reemplazar `ventas.historico` / `ventas.pronostico` en `data/series.js` por la salida real del Anexo A. |
| MAE / MAPE de Prophet | Slide 7 | No están documentados en el informe ni en el Anexo A. Cargar `ventas.metricas` en `data/series.js` (hoy `null`) y agregarlas a la slide si se decide calcularlas y mostrarlas. |

El logo institucional (slide 1) ya está resuelto: son los 3 logos reales
(UNR, FCEIA, Escuela de Ingeniería Industrial) extraídos de la portada del
PDF, en `assets/logos/`.

## De dónde sale cada dato

Los datos de los gráficos vienen del informe final del Proyecto 065-25 (PDF),
no están inventados. Según el dato, el método de extracción cambia:

| Dato | Fuente | Método |
|---|---|---|
| Pareto (34,4 / 10,2 / 9,1%) | Tabla 1, p.16 | Transcripción exacta |
| Pesos AHP (0,604 / 0,312 / 0,084) | Tabla 3, p.22 | Transcripción exacta |
| Ranking K-Means (Top 10, slide 8) | Figura 11 / Tabla 4, p.23 | Transcripción exacta |
| Política de inventario (slide 9) | Tabla 5, p.25 | Transcripción exacta |
| Organigrama (slide 3) | Figuras 1 y 2, p.6 | Transcripción exacta |
| Ventas históricas y pronóstico (slide 7) | Figuras 8 y 9, pp.17-18 | **Digitalización por color de píxel**: el informe no incluye el export numérico del notebook, así que los valores se leyeron de los gráficos publicados calibrando los ejes contra las gridlines detectadas por color. Error estimado ±3-5%. La slide lo aclara con una nota. |
| Logos institucionales (slide 1) | Portada, p.1 | Imágenes embebidas extraídas del PDF (UNR, FCEIA, Escuela de Ingeniería Industrial) |

El gráfico de la slide 7 muestra histórico y pronóstico **en un solo eje**:
tramo sólido para el dato conocido, tramo punteado para la proyección a
partir de una línea divisoria. El tramo punteado se dibuja con una animación
(un `<clipPath>` que crece de 0 al ancho total) cada vez que se entra a la
slide, para que se vea como una evolución hacia adelante del histórico; se
desactiva sola si el sistema tiene activado "reducir movimiento".

`markitdown` no funcionó en el entorno donde se armó este deck (conflicto de
`cryptography`/`pyo3` a nivel de sistema). Se usó `pymupdf` en su lugar
(`pip install pymupdf`) para extraer texto y rasterizar las páginas con
figuras/tablas relevantes.

## Sistema de diseño

Los colores, la tipografía y la geometría **no son estimados**: se leyeron del
CSS compilado de la app del agente ya desplegada
(`agente-compras-six.vercel.app/_next/static/css/…`), para que la presentación
y la demo en vivo se vean como una sola cosa.

- Tipografía: **Plus Jakarta Sans** variable (wght 200-800), servida desde
  `assets/fonts/` para que funcione sin internet.
- Paleta: tokens claros en `:root` y oscuros en `:root[data-theme="dark"]`,
  copiados uno a uno de la app. El tema arranca en claro, que es el default real
  de la app y la opción más segura para un proyector.
- Geometría: cards de radio `.75rem` con borde de 1px, pills totalmente
  redondeadas, inputs de `.5rem`, ancho de contenido `72rem`.

## Estructura

```
index.html               las 15 slides
styles.css               tokens de la app + layout + impresión
app.js                   navegación, tema y render de gráficos y diagramas
data/series.js           datos reales del informe (ventas, pareto, ahp, kmeansTop10, inventario, organigrama)
assets/fonts/            Plus Jakarta Sans (latin + latin-ext)
assets/logos/            logos institucionales reales (UNR, FCEIA, Escuela de Ingeniería Industrial)
assets/qr-agente.svg     QR hacia el agente (también está embebido en la slide 14)
tools/build_artifact.py  genera build/presentacion.html para publicar
```

`app.js` y `data/series.js` son scripts clásicos a propósito: los módulos ES no
cargan bajo `file://`, y presentar desde el archivo local es el caso principal.

## Regenerar el QR

Si cambia la URL de despliegue del agente:

```bash
pip install segno
python3 -c "import segno; segno.make('https://NUEVA-URL', error='m').save('assets/qr-agente.svg', kind='svg', scale=10, border=2, dark='#0f172a', light='#ffffff', xmldecl=False, omitsize=True, svgclass=None, lineclass=None)"
```

Después hay que pegar el `<svg>` resultante dentro de `<div class="qr">` en la
slide 14 y actualizar el texto de la URL, porque el QR va embebido en el HTML
para que no dependa de ningún archivo externo.

## Publicar

`python3 tools/build_artifact.py` arma `build/presentacion.html`: el mismo deck
en un solo archivo con el CSS, el JS y las fuentes embebidos. `index.html` sigue
siendo la fuente de verdad; el build se regenera, no se edita a mano.
