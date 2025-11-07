export default {
    testEnvironment: 'node', //el entorno donde trabajamos
    transform:{}, //import/export en cualquier lugar
    moduleFileExtensions:['js','json'], //Los archivos que queremos probar
    testMatch:['**/__test__/**/*.test.js','**/?(*.)+(spec|test).js'], //donde se encuentran 
    testPathIgnorePatterns:['/node_modules/'], //carpetas donde no queremos hacer pruebas
    collectCoverage:false, //genera resumen de las pruebas
    coverageDirectory:'coverage', //donde queremos que se guarde el resumen
}