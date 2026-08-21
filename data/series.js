/* Datos de los gráficos. Punto único de reemplazo: ver README.md
   - pareto y ahp son datos REALES del informe final.
   - historico y pronostico son ILUSTRATIVOS hasta que se peguen los
     valores del notebook. Mientras `ilustrativo` sea true, las slides
     muestran el aviso correspondiente. */

window.PRESENTACION_DATA = {
  ventas: {
    ilustrativo: true,
    articulo: "Cronos-N04",
    unidad: "pares / mes",
    /* 36 meses: enero 2023 a diciembre 2025 */
    historicoDesde: { anio: 2023, mes: 1 },
    historico: [
      8650, 9290, 10190, 9930, 9770, 9150, 8270, 9020, 10240, 10520, 9730,
      8680, 8720, 9010, 9900, 9900, 9610, 8770, 8120, 9120, 10150, 10370,
      9910, 8980, 8760, 9090, 10290, 10170, 9570, 8820, 8340, 9060, 9850,
      10260, 9880, 8670
    ],
    /* 13 meses: enero 2026 a enero 2027. [yhat, yhat_lower, yhat_upper] */
    pronosticoDesde: { anio: 2026, mes: 1 },
    pronostico: [
      [8590, 8070, 9110],
      [9070, 8480, 9660],
      [10130, 9420, 10840],
      [9970, 9220, 10720],
      [9610, 8840, 10380],
      [8970, 8210, 9730],
      [8330, 7580, 9080],
      [9090, 8230, 9950],
      [10140, 9130, 11150],
      [10510, 9410, 11610],
      [9930, 8840, 11020],
      [8780, 7770, 9790],
      [8660, 7620, 9700]
    ],
    /* Completar con los valores del notebook si se decide mostrarlos. */
    metricas: null
  },

  /* Pareto de ventas 2023-2025 (informe final) */
  pareto: [
    { articulo: "Cronos-N04", participacion: 34.4, destacado: true },
    { articulo: "Tauro 2-N04", participacion: 10.2 },
    { articulo: "Horizon-M09", participacion: 9.1 }
  ],

  /* Pesos AHP validados por encuesta (n = 10, CR aprox. 0) */
  ahp: [
    { criterio: "Alcance productivo", peso: 0.604 },
    { criterio: "Lead Time", peso: 0.312 },
    { criterio: "Volumen relativo", peso: 0.084 }
  ]
};
