/* Presentación 065-25 — navegación, tema y gráficos.
   Script clásico a propósito (sin ES modules) para que index.html también
   funcione abierto directamente con file:// el día de la defensa. */
(function () {
  "use strict";

  var D = window.PRESENTACION_DATA;
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var actual = 0;

  var SECCIONES = [
    { id: "contexto", nombre: "Contexto actual" },
    { id: "problema", nombre: "Problema y solución" },
    { id: "planificacion", nombre: "Planificación" },
    { id: "logistica", nombre: "Logística" },
    { id: "compras", nombre: "Compras" },
    { id: "conclusion", nombre: "Conclusión" }
  ];

  var MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  function nf(n, dec) {
    return n.toLocaleString("es-AR", {
      minimumFractionDigits: dec || 0,
      maximumFractionDigits: dec || 0
    });
  }

  function icono(id, tam) {
    return '<svg width="' + tam + '" height="' + tam + '" viewBox="0 0 24 24" aria-hidden="true"><use href="#' + id + '"/></svg>';
  }

  /* ---------------- Barra de secciones ---------------- */

  function montarBarras() {
    slides.forEach(function (slide) {
      var seccion = slide.getAttribute("data-seccion");
      if (!seccion) return;
      var nav = document.createElement("nav");
      nav.className = "sectionbar";
      nav.setAttribute("aria-label", "Secciones de la presentación");
      SECCIONES.forEach(function (s) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "sectionbar__item" + (s.id === seccion ? " is-active" : "");
        b.textContent = s.nombre;
        b.setAttribute("data-ir-a", s.id);
        if (s.id === seccion) b.setAttribute("aria-current", "step");
        nav.appendChild(b);
      });
      slide.insertBefore(nav, slide.firstChild);
    });

    document.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-ir-a]") : null;
      if (!b) return;
      var destino = b.getAttribute("data-ir-a");
      for (var i = 0; i < slides.length; i++) {
        if (slides[i].getAttribute("data-seccion") === destino) {
          ir(i);
          return;
        }
      }
    });
  }

  /* ---------------- Navegación ---------------- */

  var contador = document.getElementById("contador");
  var progreso = document.getElementById("progreso");

  function ir(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    slides[actual].classList.remove("is-active");
    slides[i].classList.add("is-active");
    actual = i;
    contador.textContent = i + 1 + " / " + slides.length;
    progreso.style.width = ((i + 1) / slides.length) * 100 + "%";
    document.title = slides[i].getAttribute("data-titulo") + " — Proyecto 065-25";
    if (history.replaceState) history.replaceState(null, "", "#slide-" + (i + 1));
    window.scrollTo(0, 0);
    if (slides[i].querySelector("#chart-prophet-combinado")) reiniciarAnimacionPronostico();
  }

  function desdeHash() {
    var m = /^#slide-(\d+)$/.exec(window.location.hash);
    return m ? parseInt(m[1], 10) - 1 : 0;
  }

  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target.tagName;
    if (t === "INPUT" || t === "TEXTAREA") return;
    switch (e.key) {
      case "ArrowRight":
      case "PageDown":
      case " ":
        e.preventDefault();
        ir(actual + 1);
        break;
      case "ArrowLeft":
      case "PageUp":
        e.preventDefault();
        ir(actual - 1);
        break;
      case "Home":
        e.preventDefault();
        ir(0);
        break;
      case "End":
        e.preventDefault();
        ir(slides.length - 1);
        break;
      case "f":
      case "F":
        pantallaCompleta();
        break;
      case "t":
      case "T":
        alternarTema();
        break;
    }
  });

  var x0 = null;
  var y0 = null;
  document.addEventListener("touchstart", function (e) {
    x0 = e.changedTouches[0].clientX;
    y0 = e.changedTouches[0].clientY;
  }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    var dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) ir(actual + (dx < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });

  document.getElementById("btn-prev").addEventListener("click", function () { ir(actual - 1); });
  document.getElementById("btn-next").addEventListener("click", function () { ir(actual + 1); });

  function pantallaCompleta() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  }
  document.getElementById("btn-full").addEventListener("click", pantallaCompleta);

  /* ---------------- Tema ---------------- */

  var iconoTema = document.getElementById("icono-tema");

  function aplicarTema(tema, persistir) {
    document.documentElement.setAttribute("data-theme", tema);
    iconoTema.setAttribute("href", tema === "dark" ? "#i-sun" : "#i-moon");
    if (persistir) {
      try { localStorage.setItem("tema-065-25", tema); } catch (err) { /* sin storage */ }
    }
  }

  function alternarTema() {
    aplicarTema(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
  }
  document.getElementById("btn-tema").addEventListener("click", alternarTema);

  /* ---------------- Gráficos ---------------- */

  var ESTILO = {
    grid: "stroke:var(--grid-line);stroke-width:1",
    ejeTexto: "fill:var(--color-muted-foreground);font-size:11px;font-variant-numeric:tabular-nums",
    etiqueta: "fill:var(--color-foreground);font-size:12px;font-weight:600",
    marca: "var(--color-accent)"
  };

  /* Barras horizontales, una sola serie: magnitud comparada entre categorías.
     Sin leyenda (serie única) y con el valor rotulado en la punta. */
  function barrasHorizontales(datos, opciones) {
    var W = 640;
    var alto = 46;
    var H = datos.length * alto + 10;
    var etiquetaAncho = opciones.etiquetaAncho || 210;
    var valorAncho = 74;
    var max = Math.max.apply(null, datos.map(function (d) { return d.valor; }));
    var escala = (W - etiquetaAncho - valorAncho) / max;
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + opciones.alt + '">';

    datos.forEach(function (d, i) {
      var y = i * alto + 8;
      var ancho = Math.max(4, d.valor * escala);
      var op = d.destacado === false ? 0.45 : 1;
      s += '<text x="0" y="' + (y + 17) + '" style="fill:var(--color-foreground);font-size:13px;font-weight:600">' + d.nombre + "</text>";
      /* barra fina, extremo redondeado del lado del dato y recto en la base */
      s += '<path d="M' + etiquetaAncho + " " + y +
        " H" + (etiquetaAncho + ancho - 4) +
        " a4,4 0 0 1 4,4 V" + (y + 18) +
        " a4,4 0 0 1 -4,4 H" + etiquetaAncho + ' Z" style="fill:' + ESTILO.marca + ';opacity:' + op + '"/>';
      s += '<text x="' + (etiquetaAncho + ancho + 10) + '" y="' + (y + 17) + '" style="' + ESTILO.etiqueta + '">' + d.etiqueta + "</text>";
    });
    return s + "</svg>";
  }

  function ejesY(min, max, paso) {
    var ticks = [];
    for (var v = min; v <= max + 0.5; v += paso) ticks.push(v);
    return ticks;
  }

  /* Histórico + pronóstico de Prophet en un solo gráfico: tramo histórico
     sólido (dato conocido) y tramo de pronóstico punteado (proyección),
     separados por una línea vertical. El tramo de pronóstico queda
     recortado por un <clipPath> cuyo ancho anima de 0 al total cuando se
     entra a la slide, para que se vea como una evolución hacia adelante
     del histórico (ver reiniciarAnimacionPronostico). Una sola serie
     "protagonista" lleva marcador y valor final rotulados. */
  function graficoProphetCombinado(cfg) {
    var W = 900, H = 225;
    var ml = 52, mr = 16, mt = 20, mb = 28;
    var pw = W - ml - mr, ph = H - mt - mb;
    var nHist = cfg.series[0].historico.length;
    var nFcst = cfg.series[0].pronostico.length;
    var n = nHist + nFcst;

    var todos = [];
    cfg.series.forEach(function (s) { todos = todos.concat(s.historico, s.pronostico); });
    var lo = cfg.dominio ? cfg.dominio[0] : Math.min.apply(null, todos);
    var hi = cfg.dominio ? cfg.dominio[1] : Math.max.apply(null, todos);
    var paso = 1000;
    var yMin = Math.floor((lo - paso * 0.35) / paso) * paso;
    var yMax = Math.ceil((hi + paso * 0.35) / paso) * paso;
    while ((yMax - yMin) / paso > 6) paso *= 2;

    var x = function (i) { return ml + (pw * i) / (n - 1); };
    var y = function (v) { return mt + ph - ((v - yMin) / (yMax - yMin)) * ph; };
    var xDiv = (x(nHist - 1) + x(nHist)) / 2;
    var anchoPronostico = W - mr - xDiv + 6;

    var svg = '<svg id="chart-prophet-combinado" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + cfg.alt + '">';

    svg += "<defs><clipPath id=\"clip-pronostico\"><rect class=\"forecast-reveal\" data-full-width=\"" +
      anchoPronostico + '" x="' + xDiv + '" y="' + mt + '" width="0" height="' + ph + '"/></clipPath></defs>';

    ejesY(yMin, yMax, paso).forEach(function (v) {
      svg += '<line x1="' + ml + '" x2="' + (W - mr) + '" y1="' + y(v) + '" y2="' + y(v) + '" style="' + ESTILO.grid + '"/>';
      svg += '<text x="' + (ml - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end" style="' + ESTILO.ejeTexto + '">' + nf(v) + "</text>";
    });

    cfg.marcasX.forEach(function (m) {
      svg += '<text x="' + x(m.i) + '" y="' + (H - 10) + '" text-anchor="middle" style="' + ESTILO.ejeTexto + '">' + m.texto + "</text>";
    });

    /* separador histórico / pronóstico */
    svg += '<line x1="' + xDiv + '" x2="' + xDiv + '" y1="' + mt + '" y2="' + (mt + ph) + '" style="stroke:var(--color-muted-foreground);stroke-width:1;stroke-dasharray:3 3;opacity:0.6"/>';
    svg += '<text x="' + (xDiv + 6) + '" y="' + (mt + 2) + '" style="' + ESTILO.ejeTexto + '">Pronóstico</text>';

    var contexto = cfg.series.filter(function (s) { return !s.protagonista; });
    var hero = cfg.series.filter(function (s) { return s.protagonista; })[0];

    function trazoHistorico(serie) {
      var d = serie.historico.map(function (v, i) { return (i ? "L" : "M") + x(i) + " " + y(v); }).join(" ");
      return '<path d="' + d + '" fill="none" style="' + estiloTrazo(serie) + '"/>';
    }

    function trazoPronostico(serie) {
      var puntos = [serie.historico[nHist - 1]].concat(serie.pronostico);
      var d = puntos.map(function (v, i) { return (i ? "L" : "M") + x(nHist - 1 + i) + " " + y(v); }).join(" ");
      return '<path d="' + d + '" fill="none" style="' + estiloTrazo(serie) + ';stroke-dasharray:5 4"/>';
    }

    function estiloTrazo(serie) {
      return "stroke:" + serie.color +
        ";stroke-width:" + (serie.protagonista ? 2.25 : 1.4) +
        ";stroke-linejoin:round;stroke-linecap:round" +
        (serie.protagonista ? "" : ";opacity:0.75");
    }

    contexto.forEach(function (s) { svg += trazoHistorico(s); });
    if (hero) svg += trazoHistorico(hero);

    svg += '<g clip-path="url(#clip-pronostico)">';
    contexto.forEach(function (s) { svg += trazoPronostico(s); });
    if (hero) svg += trazoPronostico(hero);
    svg += "</g>";

    if (hero) {
      var ux = x(n - 1), uy = y(hero.pronostico[nFcst - 1]);
      svg += '<g class="forecast-endpoint" style="opacity:0">' +
        '<circle cx="' + ux + '" cy="' + uy + '" r="4.5" style="fill:' + hero.color + ';stroke:var(--color-card);stroke-width:2"/>' +
        '<text x="' + (ux - 8) + '" y="' + (uy - 12) + '" text-anchor="end" style="' + ESTILO.etiqueta + '">' + nf(hero.pronostico[nFcst - 1]) + "</text></g>";
    }

    svg += "</svg>";

    var leyenda = '<div class="chart__legend">' + cfg.series.map(function (s) {
      return '<span><span class="swatch" style="background:' + s.color + '"></span>' + s.nombre + "</span>";
    }).join("") + "</div>";

    return svg + leyenda;
  }

  /* Reproduce (o repone) la animación del tramo de pronóstico: el <rect>
     que recorta el tramo punteado crece de 0 al ancho total, y el
     marcador final aparece al terminar. Se llama cada vez que se entra a
     la slide del gráfico para que la "evolución" se vea en cada pasada. */
  function reiniciarAnimacionPronostico() {
    var svg = document.getElementById("chart-prophet-combinado");
    if (!svg) return;
    var rect = svg.querySelector(".forecast-reveal");
    var endpoint = svg.querySelector(".forecast-endpoint");
    if (!rect) return;
    var full = rect.getAttribute("data-full-width");
    var reducido = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducido) {
      rect.setAttribute("width", full);
      if (endpoint) endpoint.style.opacity = "1";
      return;
    }

    rect.style.transition = "none";
    rect.setAttribute("width", "0");
    if (endpoint) {
      endpoint.style.transition = "none";
      endpoint.style.opacity = "0";
    }
    void rect.getBoundingClientRect(); /* fuerza reflow antes de animar */

    requestAnimationFrame(function () {
      rect.style.transition = "width 1700ms cubic-bezier(.22,.61,.36,1)";
      rect.setAttribute("width", full);
      if (endpoint) {
        endpoint.style.transition = "opacity 450ms ease 1500ms";
        endpoint.style.opacity = "1";
      }
    });
  }

  function marcasAnuales(desde, n, cada) {
    var marcas = [];
    for (var i = 0; i < n; i += cada) {
      var mes = (desde.mes - 1 + i) % 12;
      var anio = desde.anio + Math.floor((desde.mes - 1 + i) / 12);
      marcas.push({ i: i, texto: cada >= 12 ? String(anio) : MESES[mes] + " " + String(anio).slice(2) });
    }
    return marcas;
  }

  /* ---------------- Diagramas (HTML, no SVG: el texto fluye mejor) --------------- */

  function nodo(titulo, detalle, tag) {
    return '<div class="card stack" style="gap:0.3rem;flex:1;min-width:9rem">' +
      (tag ? '<span class="tag tag--accent">' + tag + "</span>" : "") +
      "<h3>" + titulo + "</h3>" +
      (detalle ? '<p class="metric__label" style="margin:0">' + detalle + "</p>" : "") +
      "</div>";
  }

  function flechaHoriz() {
    return '<div class="flow__arrow" style="flex:none">' + icono("i-arrow", 22) + "</div>";
  }

  function diagramaYolo() {
    var pasos = [
      ["Cámaras en los 3 racks críticos", "Captura continua, sin intervenir la operación."],
      ["YOLO detecta cajas y contenedores", "Modelo de detección de objetos en tiempo real."],
      ["Comparación contra el stock del ERP", "El conteo estimado se contrasta con el registro."],
      ["Alerta según umbral de confianza", "Observación a revisar, no un error confirmado."]
    ];
    var s = '<div class="row" style="flex-wrap:nowrap;overflow-x:auto;gap:0.4rem;align-items:stretch">';
    pasos.forEach(function (p, i) {
      if (i) s += flechaHoriz();
      s += nodo(p[0], p[1], String(i + 1));
    });
    return s + "</div>";
  }

  function diagramaMapa() {
    var capas = [
      { tag: "Planificación", t: "Prophet: pronóstico de demanda", d: "Proyecta las ventas del Cronos-N04 a 12 meses." },
      { tag: "Planificación", t: "K-Means + AHP: criticidad", d: "Sobre la proyección de insumos, separa lo crítico de lo secundario." },
      { tag: "Logística", t: "YOLO: control visual", d: "Monitorea justamente esos tres insumos, no todo el depósito." },
      { tag: "Compras", t: "Agente RAG: prioriza compras", d: "Decide con proveedores, BOM y un stock que ya es confiable." }
    ];
    var enlaces = [
      "proyección de insumos vía BOM",
      "3 insumos críticos identificados",
      "stock físico confiable"
    ];
    var s = '<div class="stack" style="gap:0.35rem">';
    capas.forEach(function (c, i) {
      if (i) {
        s += '<div class="row" style="gap:0.5rem;padding-left:1.1rem;color:var(--color-accent)">' +
          '<span style="display:inline-flex;transform:rotate(90deg)">' + icono("i-arrow", 20) + "</span>" +
          '<span class="metric__label" style="color:var(--color-muted-foreground)">' + enlaces[i - 1] + "</span></div>";
      }
      s += '<div class="card" style="display:flex;gap:0.9rem;align-items:baseline;flex-wrap:wrap">' +
        '<span class="tag tag--accent">' + c.tag + "</span>" +
        '<h3 style="flex:none">' + c.t + "</h3>" +
        '<p class="metric__label" style="margin:0;flex:1;min-width:14rem">' + c.d + "</p></div>";
    });
    return s + "</div>";
  }

  /* ---------------- Organigrama (Figuras 1 y 2 del informe) ---------------- */

  function organigrama() {
    var o = D.organigrama;
    var s = '<div class="orgchart">';
    s += '<div class="orgchart__node orgchart__node--root">' + o.directorio + "</div>";
    s += '<div class="orgchart__connector"></div>';
    s += '<div class="orgchart__node orgchart__node--root">' + o.gerenciaGeneral + "</div>";
    s += '<div class="orgchart__level"><div class="orgchart__grid">';
    o.gerencias.forEach(function (g) {
      var destacada = g === o.supplyChain;
      s += '<div class="orgchart__node' + (destacada ? " orgchart__node--highlight" : "") + '">' + g + "</div>";
    });
    s += "</div></div></div>";
    return s;
  }

  function areasSupplyChain() {
    var o = D.organigrama;
    return o.areasSupplyChain.map(function (a) {
      return '<span class="pill">' + a + "</span>";
    }).join("");
  }

  /* ---------------- Tabla K-Means (Figura 11 / Tabla 4) ---------------- */

  function tagCluster(c) {
    var clase = c === "Crítico" ? "tag--alert" : c === "Importante" ? "tag--accent" : "tag--muted";
    return '<span class="tag ' + clase + '">' + c + "</span>";
  }

  function tablaKmeans() {
    var s = '<div class="table-wrap table--compact"><table><thead><tr>' +
      '<th>Familia</th><th class="num">Score AHP</th><th>Cluster</th></tr></thead><tbody>';
    D.kmeansTop10.forEach(function (f) {
      s += '<tr class="' + (f.seleccionado ? "is-selected" : "") + '">' +
        "<td>" + f.familia + "</td>" +
        '<td class="num">' + f.score + "</td>" +
        "<td>" + tagCluster(f.cluster) + "</td></tr>";
    });
    s += "</tbody></table></div>";
    return s;
  }

  /* ---------------- Tabla de inventario (Tabla 5) ---------------- */

  function tablaInventario() {
    var s = '<div class="table-wrap"><table><thead><tr>' +
      "<th>Familia</th><th>Política</th><th class=\"num\">Stock de Seguridad</th>" +
      '<th class="num">Punto de Pedido / Nivel Objetivo</th><th>U.M.</th></tr></thead><tbody>';
    D.inventario.forEach(function (i) {
      s += "<tr><td>" + i.familia + "</td><td>" + i.politica + "</td>" +
        '<td class="num">' + i.ss + "</td>" +
        '<td class="num">' + i.puntoPedido + "</td>" +
        "<td>" + i.unidad + "</td></tr>";
    });
    s += "</tbody></table></div>";
    return s;
  }

  /* ---------------- Montaje ---------------- */

  function poner(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function dibujar() {
    poner("chart-pareto", barrasHorizontales(
      D.pareto.map(function (p) {
        return {
          nombre: p.articulo,
          valor: p.participacion,
          etiqueta: nf(p.participacion, 1) + "%",
          destacado: !!p.destacado
        };
      }),
      { alt: "Participación en ventas 2023-2025 por artículo", etiquetaAncho: 150 }
    ));

    poner("chart-ahp", barrasHorizontales(
      D.ahp.map(function (a) {
        return { nombre: a.criterio, valor: a.peso, etiqueta: a.peso.toFixed(3).replace(".", ","), destacado: true };
      }),
      { alt: "Pesos AHP por criterio", etiquetaAncho: 190 }
    ));

    var v = D.ventas;
    var COLOR_SERIE = {
      "Cronos-N04": "var(--series-cronos)",
      "Horizon-M09": "var(--series-horizon)",
      "Tauro 2-N04": "var(--series-tauro)"
    };

    var todos = [];
    v.articulos.forEach(function (art) {
      todos = todos.concat(v.historico[art], v.pronostico[art]);
    });
    var dominio = [Math.min.apply(null, todos), Math.max.apply(null, todos)];
    var nTotal = v.historico[v.protagonista].length + v.pronostico[v.protagonista].length;

    poner("chart-prophet", graficoProphetCombinado({
      series: v.articulos.map(function (art) {
        return {
          nombre: art,
          historico: v.historico[art],
          pronostico: v.pronostico[art],
          color: COLOR_SERIE[art],
          protagonista: art === v.protagonista
        };
      }),
      dominio: dominio,
      historicoDesde: v.historicoDesde,
      marcasX: marcasAnuales(v.historicoDesde, nTotal, 6),
      alt: "Ventas mensuales por artículo: histórico enero 2023 a diciembre 2025 y pronóstico Prophet enero a diciembre 2026"
    }));

    poner("chart-yolo", diagramaYolo());
    poner("chart-mapa", diagramaMapa());
    poner("chart-organigrama", organigrama());
    poner("areas-supply-chain", areasSupplyChain());
    poner("tabla-kmeans", tablaKmeans());
    poner("tabla-inventario", tablaInventario());
  }

  /* ---------------- Arranque ---------------- */

  /* Preferencia guardada; si no hay, el atributo que ya traiga el documento
     (en index.html es "light"; publicado como Artifact lo estampa el visor). */
  var guardado = null;
  try { guardado = localStorage.getItem("tema-065-25"); } catch (err) { /* sin storage */ }
  var inicial = guardado || document.documentElement.getAttribute("data-theme") || "light";
  aplicarTema(inicial === "dark" ? "dark" : "light", false);

  montarBarras();
  dibujar();
  ir(desdeHash());
  window.addEventListener("hashchange", function () {
    var i = desdeHash();
    if (i !== actual) ir(i);
  });
})();
