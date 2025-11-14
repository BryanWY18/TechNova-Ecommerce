import {defineConfig} from 'cypress';

export default defineConfig({
    e2e:{
        baseUrl:'http://localhost:4200',
        spectPattern:'cypress/e2e/**/*.cy.{js,ts}',
        defaultCommandTimeout:8000
    }
});