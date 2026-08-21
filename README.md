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
| Logo FCEIA-UNR | Slide 1 | Guardar el logo en `assets/logo-fceia.svg` (o `.png`) y reemplazar el `<div class="asset-pendiente asset-pendiente--logo">` por `<img src="assets/logo-fceia.svg" alt="FCEIA - UNR">`. |
| Texto de agradecimiento | Slide 2 | Reemplazar el `<div class="asset-pendiente">` que sigue al título "Agradecimientos" por el texto. Lo escriben los autores. |
| Fotos de los 3 insumos críticos | Slide 8 | Guardarlas en `assets/insumos/` y reemplazar cada `<div class="asset-pendiente">` por `<img src="assets/insumos/....jpg" alt="...">`. |
| Series reales de Prophet | Slide 7 | Ver abajo. |
| MAE / MAPE de Prophet | Slide 7 | Cargar `metricas` en `data/series.js` (hoy `null`) y agregarlas a la slide si se decide mostrar precisión numérica. |

### Reemplazar los datos ilustrativos de Prophet

`data/series.js` es el único lugar a tocar. Los valores de `pareto` y `ahp` ya
son los reales del informe; `ventas.historico` y `ventas.pronostico` son
ilustrativos.

1. Pegar en `ventas.historico` los 36 valores mensuales reales (enero 2023 a
   diciembre 2025) y en `ventas.pronostico` las 13 ternas
   `[yhat, yhat_lower, yhat_upper]` (enero 2026 a enero 2027) que devuelve el
   notebook.
2. Cambiar `ventas.ilustrativo` a `false`.

Al hacerlo, el aviso "Datos ilustrativos" de la slide 7 desaparece solo y los
dos gráficos se redibujan con la escala compartida recalculada.

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
data/series.js           datos de los gráficos (único punto de reemplazo)
assets/fonts/            Plus Jakarta Sans (latin + latin-ext)
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
