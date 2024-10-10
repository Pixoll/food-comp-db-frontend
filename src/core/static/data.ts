 //ESTO ES PARA PROBAR LOS GRAFICOS
 const data = [
    { name: "Grasa", value: 5.34, fill: "#4B9CD3" }, // Azul claro
    { name: "Carbohidratos", value: 25.31, fill: "#F5B041" }, // Amarillo
    { name: "Fibra alimentaria", value: 9.43, fill: "#E67E22" }, // Naranja
    { name: "Alcohol", value: 31.05, fill: "#E74C3C" }, // Rojo
    { name: "Proteina", value: 22.56, fill: "#9B59B6" }, // Morado
    { name: "Agua", value: 1.39, fill: "#3498DB" }, // Azul medio
    { name: "Otros", value: 4.91, fill: "#2ECC71" }, // Verde
  ];

  //PARA PROBAR LA TABLA
  const nutrients = [
    { name: 'Energía [kJ]', quantity: '262' },
    { name: 'Energía [kcal]', quantity: '62' },
    { name: 'Proteína [g]', quantity: '0.83' },
    { name: 'Grasa total [g]', quantity: '0' },
    { name: 'Carbohidratos disponibles [g]', quantity: '12.8' },
    { name: 'Sodio [mg]', quantity: '11.1' },
    { name: 'Colesterol [mg]', quantity: '0.83' },
    { name: 'Azúcares totales [g]', quantity: '0.0325' },
  ];

  const data2 = [{
    codigo: "CLA0001B",
    nombre_espanol: "Ajo negro, polvo, procesado, sin ingredientes añadidos, Allium sativum, Quilpué - Chile",
    nombre_portugues: "Alho preto, em pó, processado, s/ adição de ingredientes, Allium sativum, Quilpué - Chile",
    nombre_ingles: "Black garlic, powder, processed, without added ingredients, Allium sativum, Quilpué - Chile",
    nombre_cientifico: "Allium sativum",
    region_origen: "Quilpué - Chile",
    marca: "",
    grupo: "B",
    tipo_alimento: "B",
    codigo_langual: [
      "A00GY", "B1233", "C0290", "E0106", "F0014", "G0003", "H0138", 
      "J0004", "J0116", "K0003", "M0166", "N0003", "P0024", "R0192", 
      "Z0154", "Z0253", "Z0287"
    ],
    observacion: "Calor, humedad, ozonizacion",
    valores_nutricionales: {
      energy: [
        {
          unit: "kcal",
          amount: 346.99,
          deviation: null,
          min: null,
          max: null,
          type: "Calculado"
        },
        {
          unit: "kJ",
          amount: 1470.39,
          deviation: null,
          min: null,
          max: null,
          type: "Calculado"
        }
      ],
      main_nutrients: [
        {
          nutrient: "fat",
          amount: 0.39,
          deviation: null,
          min: null,
          max: null,
          type: "Analítico",
          components: [
            { type: "saturated", amount: null },
            { type: "monounsaturated", amount: null },
            { type: "polyunsaturated", amount: null }
          ]
        },
        {
          nutrient: "carbohydrates",
          amount: 73.35,
          deviation: null,
          min: null,
          max: null,
          type: "Calculado",
          components: [
            { type: "available_carbohydrates", amount: 65.69 },
            { type: "fiber", amount: 7.66 }
          ]
        },
        {
          nutrient: "protein",
          amount: 16.35,
          deviation: null,
          min: null,
          max: null,
          type: "Analítico"
        },
        {
          nutrient: "alcohol",
          amount: 0.0,
          deviation: null,
          min: null,
          max: null,
          type: "Analítico"
        },
        {
          nutrient: "water",
          amount: 5.8,
          deviation: null,
          min: null,
          max: null,
          type: "Promedio"
        },
        {
          nutrient: "ash",
          amount: 4.11,
          deviation: null,
          min: null,
          max: null,
          type: "Analítico"
        }
      ],
      micronutrients: {
        vitamins: [
          {
            vitamin: "vitamin_a",
            unit: "RE mcg",
            amount: 8.4,
            deviation: null,
            min: null,
            max: null,
            type: "Analítico"
          },
          {
            vitamin: "vitamin_d",
            unit: "mcg",
            amount: 0.2,
            deviation: null,
            min: null,
            max: null,
            type: "Analítico"
          }
        ],
        minerals: [
          {
            mineral: "calcium",
            unit: "mg",
            amount: 113.0,
            deviation: null,
            min: null,
            max: null,
            type: "Analítico"
          },
          {
            mineral: "iron",
            unit: "mg",
            amount: 6.68,
            deviation: null,
            min: null,
            max: null,
            type: "Analítico"
          },
          {
            mineral: "sodium",
            unit: "mg",
            amount: 108.0,
            deviation: null,
            min: null,
            max: null,
            type: "Analítico"
          },
          {
            mineral: "phosphorus",
            unit: "mg",
            amount: 310,
            deviation: null,
            min: null,
            max: null,
            type: "Analítico"
          }
        ],
        
      }
    },
    referencia: {
      codigo: 1,
      tipo_dato: "Analítico"
    }
}];

const data3 = [{
    codigo: "CLA0001B",
    nombre_espanol: "Ajo negro, polvo, procesado, sin ingredientes añadidos, Allium sativum, Quilpué - Chile",
    nombre_portugues: "Alho preto, em pó, processado, s/ adição de ingredientes, Allium sativum, Quilpué - Chile",
    nombre_ingles: "Black garlic, powder, processed, without added ingredients, Allium sativum, Quilpué - Chile",
    nombre_cientifico: "Allium sativum",
    region_origen: "Quilpué - Chile",
    marca: "",
    grupo: "B",
    tipo_alimento: "B",
    codigo_langual: [
      "A00GY", "B1233", "C0290", "E0106", "F0014", "G0003", "H0138", 
      "J0004", "J0116", "K0003", "M0166", "N0003", "P0024", "R0192", 
      "Z0154", "Z0253", "Z0287"
    ],
    observacion: "Calor, humedad, ozonizacion",
    valores_nutricionales: {
      promedio: {
        humedad: 5.8,
        energia_kj: 1470.39,
        energia_kcal: 346.99,
        carbohidratos_totales: 73.35,
        carbohidratos_disponibles: 65.69,
        proteina: 16.35,
        lipido_total: 0.39,
        fibra: 7.66,
        alcohol: 0.0,
        cenizas: 4.11,
        calcio_mg: 113.0,
        hierro_mg: 6.68,
        sodio_mg: 108.0,
        fosforo_mg: 310,
        vitamina_a_re_mcg: 8.4,
        vitamina_d_mcg: 0.2
      },
      desviacion: null,
      minimo: null,
      maximo: null,
      n: {
        humedad: 1,
        proteina: 1,
        calcio_mg: 1,
        hierro_mg: 1,
        sodio_mg: 1,
        fosforo_mg: 1,
        vitamina_a_re_mcg: 1,
        vitamina_d_mcg: 1
      }
    },
    referencia: {
      codigo: 1,
      tipo_dato: "Analítico"
    }
  }
]

export { data, nutrients, data2, data3 };