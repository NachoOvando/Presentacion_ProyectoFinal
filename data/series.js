/* Datos de los gráficos, tomados del informe final del Proyecto 065-25
   (Guaita - Ovando). Cada bloque cita su figura/tabla de origen y aclara
   si es transcripción exacta o digitalización aproximada. Ver README.md
   para el detalle del método. */

window.PRESENTACION_DATA = {
  /* Figuras 8 y 9 (pp. 17-18) - ventas mensuales por artículo, histórico
     y pronóstico Prophet. Los valores están DIGITALIZADOS por color de
     píxel desde los gráficos publicados (calibración de ejes por
     gridlines detectadas programáticamente) porque el informe no incluye
     el export numérico del notebook: son una lectura aproximada del
     gráfico real, no el CSV exacto. Error estimado ±3-5%. */
  ventas: {
    unidad: "pares / mes",
    articulos: ["Cronos-N04", "Tauro 2-N04", "Horizon-M09"],
    protagonista: "Cronos-N04",
    /* 36 meses: enero 2023 a diciembre 2025 (Figura 8) */
    historicoDesde: { anio: 2023, mes: 1 },
    historico: {
      "Cronos-N04": [
        5930, 6410, 11150, 3470, 8190, 12940, 8810, 11700, 10270, 10180,
        9220, 9510, 7080, 8270, 11700, 10510, 12310, 13530, 12040, 12770,
        13170, 11420, 11970, 10730, 8780, 10110, 15200, 12260, 13090,
        13740, 11960, 12610, 12880, 11180, 11690, 10720
      ],
      "Tauro 2-N04": [
        1560, 1940, 3470, 1630, 3030, 5820, 1210, 2550, 1550, 2790, 4090,
        2880, 2120, 2440, 3470, 3150, 3680, 4030, 3580, 3800, 3920, 3410,
        3530, 3200, 2640, 2980, 4500, 3680, 3920, 4090, 3530, 3760, 3850,
        3340, 3470, 3180
      ],
      "Horizon-M09": [
        4490, 3530, 4890, 2660, 3310, 3260, 3870, 1850, 2850, 1740, 1670,
        1580, 1660, 1980, 2770, 2520, 2930, 3220, 2850, 3040, 3120, 2710,
        2830, 2560, 2140, 2440, 3710, 2960, 3150, 3300, 2880, 3040, 3100,
        2710, 2830, 2580
      ]
    },
    /* 12 meses: enero a diciembre 2026 (Figura 9, tramo posterior a la
       línea de "Fin de datos históricos") */
    pronosticoDesde: { anio: 2026, mes: 1 },
    pronostico: {
      "Cronos-N04": [
        9170, 8220, 11270, 10990, 9370, 12010, 12000, 10750, 11280, 10160,
        9340, 8810
      ],
      "Tauro 2-N04": [
        2920, 2880, 3740, 3690, 3480, 4690, 4360, 3120, 3430, 3210, 3790,
        3910
      ],
      "Horizon-M09": [
        2680, 2960, 3540, 3550, 3210, 3580, 3690, 3370, 3320, 3240, 2960,
        2850
      ]
    },
    /* No documentadas en el informe ni en el Anexo A. */
    metricas: null
  },

  /* Tabla 1 (p.16) - Pareto de ventas 2023-2025. Transcripción exacta. */
  pareto: [
    { articulo: "Cronos-N04", participacion: 34.4, destacado: true },
    { articulo: "Tauro 2-N04", participacion: 10.2 },
    { articulo: "Horizon-M09", participacion: 9.1 }
  ],

  /* Tabla 3 (p.22) - pesos AHP validados por encuesta (n=10, CR aprox. 0).
     Transcripción exacta. */
  ahp: [
    { criterio: "Alcance productivo", peso: 0.604 },
    { criterio: "Lead Time", peso: 0.312 },
    { criterio: "Volumen relativo", peso: 0.084 }
  ],

  /* Figura 11 / Tabla 4 (p.23) - top 10 de familias de insumos por Score
     AHP descendente, con sus 3 variables normalizadas (0-100) y el
     cluster de criticidad asignado por K-Means. Transcripción exacta.
     seleccionado=true: los 3 insumos elegidos para el resto del proyecto. */
  kmeansTop10: [
    { familia: "Conjunto Sistema PU", volumen: 100, alcance: 100, leadTime: 100, score: 100, cluster: "Crítico", seleccionado: true },
    { familia: "Sistema PU Tinta, Gris", volumen: 3, alcance: 100, leadTime: 62, score: 80, cluster: "Importante" },
    { familia: "Puntera Acero 59 Normal", volumen: 100, alcance: 67, leadTime: 88, score: 76, cluster: "Crítico", seleccionado: true },
    { familia: "Caja Empaque (Bota/Botín)", volumen: 100, alcance: 67, leadTime: 62, score: 68, cluster: "Crítico", seleccionado: true },
    { familia: "Sistema PU Tinta, Negro", volumen: 0, alcance: 67, leadTime: 62, score: 60, cluster: "Importante" },
    { familia: "Puntera Aluminio 459 Normal", volumen: 21, alcance: 33, leadTime: 88, score: 49, cluster: "Importante" },
    { familia: "Cordón Trenz Negro, 0,90m", volumen: 100, alcance: 67, leadTime: 0, score: 49, cluster: "Crítico" },
    { familia: "Inserto B/PU UL Trasero", volumen: 21, alcance: 33, leadTime: 62, score: 41, cluster: "Importante" },
    { familia: "Inserto B/PU UL Delantero", volumen: 21, alcance: 33, leadTime: 62, score: 41, cluster: "Importante" },
    { familia: "Sistema PU Tinta, Hueso", volumen: 0, alcance: 33, leadTime: 62, score: 40, cluster: "Importante" }
  ],

  /* Tabla 5 (p.25) - parámetros reales de política de inventario para los
     3 insumos críticos. Z=2,05 (nivel de servicio 98%). Transcripción
     exacta. */
  inventario: [
    { familia: "Conjunto Sistema PU", politica: "Revisión continua (s,Q)", ss: "719.037,2", puntoPedido: "13.497.948,1", unidad: "Gramos", etiquetaPunto: "Punto de Pedido" },
    { familia: "Puntera Acero 59 Normal", politica: "Revisión periódica (R,S)", ss: "1.747,5", puntoPedido: "35.050,5", unidad: "Par", etiquetaPunto: "Nivel Objetivo" },
    { familia: "Caja Empaque (Bota/Botín)", politica: "Revisión periódica (R,S)", ss: "1.617,8", puntoPedido: "30.163,3", unidad: "Unidad", etiquetaPunto: "Nivel Objetivo" }
  ],

  /* Figuras 1 y 2 (p.6) - organigrama de Maincal S.A. por gerencia, y
     desagregado de la Gerencia de Supply Chain. Transcripción exacta. */
  organigrama: {
    directorio: "Directorio",
    gerenciaGeneral: "Gerencia General",
    gerencias: [
      "Gerencia de Administración y Finanzas",
      "Gerencia Comercial",
      "Gerencia de Desarrollo Comercial",
      "Gerencia de Innovación e Ingeniería",
      "Gerencia de Producción",
      "Gerencia de Recursos Humanos",
      "Gerencia de Sistemas",
      "Gerencia de Supply Chain"
    ],
    supplyChain: "Gerencia de Supply Chain",
    areasSupplyChain: ["Planificación", "Logística", "Compras"]
  }
};
