export default {
  testEnvironment: "node", // en entorno en donde trabajamos
  transform: {}, //import/exporte en cuaalquier lugar
  moduleFileExtensions: ["js", "json"], //los archivos que queremos probar
  testMatch: ["**/__test__/**/*.test.js", "**/?(*.)+(spec|test).js"], //donde se encuentran nuestras pruebas
  testPathIgnorePatterns: ["/node_modules/"], //carpetas donde no queremos hacer pruebas
  collectCoverage: true, // genera resumen detallado
  coverageDirectory: "coverage", // donde queremos que guarde el resumen
};
