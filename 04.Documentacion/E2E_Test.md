# Guía Completa de Pruebas E2E con Cypress en Angular 19

**Documentación oficial de Cypress**: https://www.cypress.io/

---

## Tabla de Contenidos

1. [¿Qué son las Pruebas E2E?](#qué-son-las-pruebas-e2e)
2. [¿Por Qué Cypress?](#por-qué-cypress)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Anatomía de una Prueba E2E](#anatomía-de-una-prueba-e2e)
5. [Comandos Básicos de Cypress](#comandos-básicos-de-cypress)
6. [Selectores y Mejores Prácticas](#selectores-y-mejores-prácticas)
7. [Interceptando Peticiones HTTP](#interceptando-peticiones-http)
8. [Ejemplos Prácticos Completos](#ejemplos-prácticos-completos)
9. [Ejecutando las Pruebas](#ejecutando-las-pruebas)
10. [Mejores Prácticas](#mejores-prácticas)
11. [Errores Comunes](#errores-comunes-y-soluciones)

---

## ¿Qué son las Pruebas E2E?

### El Concepto Básico

**E2E** significa **End-to-End** (de principio a fin). Son pruebas que simulan exactamente lo que haría un usuario real en tu aplicación web.

Imagina que tienes una tienda online. Una prueba E2E sería:

1. Un robot abre tu sitio web
2. Hace clic en "Registrarse"
3. Llena el formulario con sus datos
4. Hace clic en "Crear cuenta"
5. Verifica que aparezca un mensaje de "Cuenta creada exitosamente"

Todo esto sucede automáticamente, sin que tú tengas que hacer clic en nada.

### Diferencia con Pruebas Unitarias

```typescript
// PRUEBA UNITARIA - Prueba una función aislada
it('debería sumar dos números', () => {
  const resultado = sumar(2, 3);
  expect(resultado).toBe(5);
});

// PRUEBA E2E - Prueba el flujo completo de usuario
it('debería permitir al usuario comprar un producto', () => {
  cy.visit('/productos');                    // Ir a la página
  cy.get('[data-cy="producto-1"]').click(); // Seleccionar producto
  cy.get('[data-cy="agregar-carrito"]').click(); // Agregar al carrito
  cy.get('[data-cy="ir-carrito"]').click(); // Ir al carrito
  cy.get('[data-cy="total"]').should('contain', '$999'); // Verificar total
  cy.get('[data-cy="finalizar-compra"]').click(); // Comprar
  cy.url().should('include', '/exito'); // Verificar redirección
});
```

### ¿Por Qué Son Importantes?

Las pruebas E2E detectan problemas que las pruebas unitarias no pueden:

```typescript
// Estos casos solo se detectan con E2E:

// 1. Problema de navegación
// El botón funciona, pero redirige a la página equivocada

// 2. Problema de estilos
// El formulario funciona, pero está oculto por CSS

// 3. Problema de integración
// El backend y frontend funcionan solos, pero no se comunican bien

// 4. Problema de permisos
// El usuario puede ver el botón pero no debería tener acceso
```

---

## ¿Por Qué Cypress?

Cypress es como tener un robot que usa tu aplicación exactamente como lo haría una persona real.

### Ventajas de Cypress

**1. Fácil de Usar**

```typescript
// Esto es TODO lo que necesitas para probar un login
cy.visit('/login');
cy.get('input[type="email"]').type('usuario@ejemplo.com');
cy.get('input[type="password"]').type('miPassword123');
cy.get('button[type="submit"]').click();
cy.url().should('not.include', '/login'); // Verificar que salió del login
```

**2. Muestra lo que Está Pasando**

Cuando ejecutas Cypress en modo interactivo, puedes VER cada paso:
- Se abre un navegador real
- Ves cómo hace clic en los botones
- Ves cómo llena los formularios
- Puedes pausar y debuggear en cualquier momento

**3. Espera Automática**

```typescript
// Cypress espera automáticamente a que el elemento exista
cy.get('button').click(); // No necesitas decirle que espere

// En otras herramientas tendrías que hacer:
// waitForElement('button')
// then click('button')
```

**4. Viaja en el Tiempo**

Puedes hacer clic en cualquier paso de la prueba y ver exactamente cómo estaba la aplicación en ese momento.

---

## Instalación y Configuración

### Paso 1: Instalar Cypress

```bash
# En la raíz de tu proyecto Angular
npm install --save-dev cypress
```

### Paso 2: Abrir Cypress por Primera Vez

```bash
npx cypress open
```

Esto creará la estructura de carpetas necesaria:

```
tu-proyecto/
├── cypress/
│   ├── e2e/                    # Aquí van tus pruebas
│   │   └── ejemplo.cy.ts
│   ├── fixtures/               # Datos de prueba
│   │   └── usuarios.json
│   ├── support/                # Comandos personalizados
│   │   ├── commands.ts
│   │   └── e2e.ts
│   └── screenshots/            # Screenshots de errores
│   └── videos/                 # Videos de las pruebas
├── cypress.config.ts           # Configuración principal
└── package.json
```

### Paso 3: Configurar Cypress

Edita `cypress.config.ts`:

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // URL base de tu aplicación
    baseUrl: 'http://localhost:4200',
    
    // Dónde están las pruebas
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    
    // No necesitamos archivo de soporte para empezar
    supportFile: false,
    
    // Configuraciones útiles
    viewportWidth: 1280,    // Ancho del navegador de prueba
    viewportHeight: 720,    // Alto del navegador de prueba
    
    // Tiempo de espera por defecto
    defaultCommandTimeout: 10000,
    
    // Grabar videos solo de pruebas fallidas
    video: true,
    videoCompression: 32,
    
    // Tomar screenshots de errores
    screenshotOnRunFailure: true,
  },
});
```

### Paso 4: Agregar Scripts a package.json

```json
{
  "scripts": {
    "start": "ng serve",
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
  }
}
```


---

## Anatomía de una Prueba E2E

### Estructura Básica

Toda prueba E2E sigue este patrón:

```typescript
describe('Nombre del Grupo de Pruebas', () => {
  
  // Configuración antes de cada prueba
  beforeEach(() => {
    // Código que se ejecuta ANTES de cada prueba
    cy.visit('/');
    cy.clearLocalStorage();
  });

  // Una prueba individual
  it('descripción de lo que prueba', () => {
    // 1. PREPARAR (Arrange)
    // Navegar a la página, configurar datos
    
    // 2. ACTUAR (Act)
    // Interactuar con la aplicación (clicks, escribir, etc.)
    
    // 3. VERIFICAR (Assert)
    // Comprobar que sucedió lo esperado
  });
});
```

### Ejemplo Real: Prueba de Login

```typescript
// cypress/e2e/login.cy.ts

describe('Sistema de Login', () => {
  
  // Ejecutar antes de cada prueba
  beforeEach(() => {
    // Ir a la página de login
    cy.visit('/login');
    
    // Limpiar localStorage (tokens, sesiones previas)
    cy.clearLocalStorage();
  });

  it('debería permitir login con credenciales correctas', () => {
    // ===== PREPARAR =====
    const email = 'usuario@ejemplo.com';
    const password = 'Password123!';

    // ===== ACTUAR =====
    // Encontrar el campo de email y escribir
    cy.get('input[type="email"]').type(email);
    
    // Encontrar el campo de password y escribir
    cy.get('input[type="password"]').type(password);
    
    // Hacer clic en el botón de submit
    cy.get('button[type="submit"]').click();

    // ===== VERIFICAR =====
    // La URL ya no debería incluir '/login'
    cy.url().should('not.include', '/login');
    
    // Debería estar en la página de inicio
    cy.url().should('include', '/');
    
    // Debería mostrar el nombre del usuario
    cy.get('[data-cy="user-name"]').should('be.visible');
  });

  it('debería mostrar error con credenciales incorrectas', () => {
    // ===== ACTUAR =====
    cy.get('input[type="email"]').type('email@invalido.com');
    cy.get('input[type="password"]').type('passwordIncorrecto');
    cy.get('button[type="submit"]').click();

    // ===== VERIFICAR =====
    // Debería seguir en la página de login
    cy.url().should('include', '/login');
    
    // Debería mostrar un mensaje de error
    cy.get('[data-cy="error-message"]')
      .should('be.visible')
      .and('contain', 'Credenciales incorrectas');
  });

  it('debería desabilitar el botón si faltan campos', () => {
    // ===== ACTUAR =====
    // Solo llenar el email, dejar password vacío
    cy.get('input[type="email"]').type('usuario@ejemplo.com');

    // ===== VERIFICAR =====
    // El botón debería estar deshabilitado
    cy.get('button[type="submit"]').should('be.disabled');
  });
});
```

---

## Comandos Básicos de Cypress

### Navegación

```typescript
// Ir a una página
cy.visit('/productos');

// Ir a una URL completa
cy.visit('https://ejemplo.com');

// Ir a una ruta relativa a baseUrl
cy.visit('/productos/123');

// Recargar la página
cy.reload();

// Ir hacia atrás
cy.go('back');

// Ir hacia adelante
cy.go('forward');
```

### Seleccionar Elementos

```typescript
// Por etiqueta HTML
cy.get('button');
cy.get('input');
cy.get('div');

// Por clase CSS
cy.get('.btn-primary');
cy.get('.card-title');

// Por ID
cy.get('#email-input');
cy.get('#submit-button');

// Por atributo
cy.get('[type="email"]');
cy.get('[placeholder="Buscar..."]');

// Por data-cy (RECOMENDADO)
cy.get('[data-cy="login-button"]');
cy.get('[data-cy="product-card"]');

// Combinar selectores
cy.get('button.btn-primary[type="submit"]');

// Selector de texto
cy.contains('Iniciar Sesión');
cy.contains('button', 'Guardar');
```

### Interactuar con Elementos

```typescript
// ===== ESCRIBIR EN INPUTS =====

// Escribir texto
cy.get('input[type="email"]').type('usuario@ejemplo.com');

// Escribir y presionar Enter
cy.get('input[type="search"]').type('laptop{enter}');

// Limpiar y escribir
cy.get('input[type="text"]').clear().type('nuevo texto');

// Escribir lentamente (simular escritura humana)
cy.get('input').type('texto lento', { delay: 100 });

// ===== CLICKS =====

// Click simple
cy.get('button').click();

// Click forzado (incluso si está oculto)
cy.get('button').click({ force: true });

// Doble click
cy.get('button').dblclick();

// Click derecho
cy.get('div').rightclick();

// ===== SELECTS (DROPDOWN) =====

// Seleccionar por valor
cy.get('select').select('valor1');

// Seleccionar por texto visible
cy.get('select').select('Opción 1');

// Seleccionar múltiples opciones
cy.get('select[multiple]').select(['opcion1', 'opcion2']);

// ===== CHECKBOXES Y RADIO BUTTONS =====

// Marcar checkbox
cy.get('input[type="checkbox"]').check();

// Desmarcar checkbox
cy.get('input[type="checkbox"]').uncheck();

// Seleccionar radio button
cy.get('input[type="radio"][value="opcion1"]').check();

// ===== SUBIR ARCHIVOS =====

// Subir un archivo
cy.get('input[type="file"]').selectFile('cypress/fixtures/imagen.jpg');

// Subir arrastrando
cy.get('.dropzone').selectFile('archivo.pdf', { action: 'drag-drop' });
```

### Verificaciones (Assertions)

```typescript
// ===== EXISTENCIA Y VISIBILIDAD =====

// Verificar que existe
cy.get('button').should('exist');

// Verificar que es visible
cy.get('div').should('be.visible');

// Verificar que NO es visible
cy.get('.modal').should('not.be.visible');

// ===== CONTENIDO DE TEXTO =====

// Contiene texto
cy.get('h1').should('contain', 'Bienvenido');

// Texto exacto
cy.get('p').should('have.text', 'Exactamente este texto');

// ===== VALORES DE INPUTS =====

// Input tiene un valor
cy.get('input').should('have.value', 'valor esperado');

// Input está vacío
cy.get('input').should('have.value', '');

// ===== CLASES CSS =====

// Tiene una clase
cy.get('button').should('have.class', 'active');

// No tiene una clase
cy.get('button').should('not.have.class', 'disabled');

// ===== ATRIBUTOS =====

// Tiene un atributo
cy.get('button').should('have.attr', 'type', 'submit');

// Está deshabilitado
cy.get('button').should('be.disabled');

// Está habilitado
cy.get('button').should('be.enabled');

// ===== URLS =====

// URL incluye texto
cy.url().should('include', '/dashboard');

// URL exacta
cy.url().should('eq', 'http://localhost:4200/productos');

// ===== LONGITUD Y CANTIDAD =====

// Cantidad de elementos
cy.get('.producto').should('have.length', 10);

// Al menos N elementos
cy.get('.producto').should('have.length.at.least', 1);

// ===== MÚLTIPLES VERIFICACIONES =====

cy.get('button')
  .should('be.visible')
  .and('contain', 'Guardar')
  .and('have.class', 'btn-primary')
  .and('be.enabled');
```

### Esperas y Tiempos

```typescript
// Esperar un tiempo fijo (evitar si es posible)
cy.wait(1000); // Espera 1 segundo

// Esperar una petición HTTP (RECOMENDADO)
cy.intercept('GET', '/api/productos').as('getProductos');
cy.visit('/productos');
cy.wait('@getProductos');

// Esperar que un elemento exista
cy.get('button', { timeout: 10000 }).should('exist');

// Esperar que desaparezca un loading
cy.get('.loading-spinner').should('not.exist');
```

---

## Selectores y Mejores Prácticas

### El Problema con Selectores Frágiles

```html
<!-- HTML de tu aplicación -->
<button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
  Iniciar Sesión
</button>
```

```typescript
// ❌ MALO - Se rompe si cambias los estilos
cy.get('.bg-blue-500').click();

// ❌ MALO - Se rompe si cambias el texto
cy.contains('Iniciar Sesión').click();

// ✅ BUENO - Usa data-cy
cy.get('[data-cy="login-button"]').click();
```

### Usar data-cy: La Mejor Práctica

**En tu HTML**:

```html
<!-- Agrega data-cy a elementos importantes -->
<button 
  data-cy="login-button"
  class="bg-blue-500 text-white px-4 py-2 rounded"
>
  Iniciar Sesión
</button>

<input 
  data-cy="email-input"
  type="email" 
  placeholder="Email"
>

<div data-cy="error-message" class="text-red-500">
  Error en el login
</div>

<div data-cy="product-card" class="bg-white shadow rounded p-4">
  <h3 data-cy="product-name">Laptop Dell</h3>
  <p data-cy="product-price">$999</p>
  <button data-cy="add-to-cart-btn">Agregar al Carrito</button>
</div>
```

**En tus pruebas**:

```typescript
describe('Carrito de Compras', () => {
  it('debería agregar un producto al carrito', () => {
    cy.visit('/productos');
    
    // Seleccionar el primer producto
    cy.get('[data-cy="product-card"]')
      .first()
      .within(() => {
        // Verificar nombre del producto
        cy.get('[data-cy="product-name"]').should('be.visible');
        
        // Verificar precio
        cy.get('[data-cy="product-price"]').should('contain', '$');
        
        // Click en agregar al carrito
        cy.get('[data-cy="add-to-cart-btn"]').click();
      });
    
    // Verificar que se agregó
    cy.get('[data-cy="cart-count"]').should('contain', '1');
  });
});
```

### Ventajas de data-cy

1. **No se rompe con cambios de estilo**: Puedes cambiar clases de Tailwind sin romper las pruebas
2. **No se rompe con cambios de texto**: Puedes traducir tu app sin romper las pruebas
3. **Semántico**: Está claro qué estás probando
4. **Fácil de mantener**: Un desarrollador nuevo entiende qué hace la prueba

---

## Interceptando Peticiones HTTP

Una de las características más poderosas de Cypress es interceptar y controlar peticiones HTTP.

### ¿Por Qué Interceptar Peticiones?

1. **Esperar a que terminen**: No continuar la prueba hasta que la petición complete
2. **Verificar que se hicieron**: Asegurar que tu app está llamando a las APIs correctas
3. **Controlar respuestas**: Probar cómo se comporta tu app con diferentes respuestas
4. **Simular errores**: Probar cómo maneja tu app errores del servidor

### Interceptar y Esperar

```typescript
describe('Lista de Productos', () => {
  it('debería cargar productos desde la API', () => {
    // ===== 1. INTERCEPTAR LA PETICIÓN =====
    cy.intercept('GET', '**/api/products*').as('getProducts');
    
    // ===== 2. VISITAR LA PÁGINA =====
    cy.visit('/productos');
    
    // ===== 3. ESPERAR A QUE TERMINE =====
    cy.wait('@getProducts');
    
    // ===== 4. VERIFICAR =====
    cy.get('[data-cy="product-card"]').should('have.length.at.least', 1);
  });
});
```

### Verificar Detalles de la Petición

```typescript
it('debería enviar los parámetros correctos', () => {
  cy.intercept('GET', '**/api/products*').as('getProducts');
  
  cy.visit('/productos?categoria=laptops&orden=precio');
  
  cy.wait('@getProducts').then((interception) => {
    // Verificar la URL completa
    expect(interception.request.url).to.include('categoria=laptops');
    expect(interception.request.url).to.include('orden=precio');
    
    // Verificar headers
    expect(interception.request.headers).to.have.property('authorization');
  });
});
```

### Verificar la Respuesta

```typescript
it('debería recibir una respuesta exitosa', () => {
  cy.intercept('POST', '**/api/auth/login').as('loginRequest');
  
  cy.visit('/login');
  cy.get('[data-cy="email-input"]').type('usuario@ejemplo.com');
  cy.get('[data-cy="password-input"]').type('Password123!');
  cy.get('[data-cy="login-button"]').click();
  
  cy.wait('@loginRequest').then((interception) => {
    // Verificar código de estado
    expect(interception.response.statusCode).to.equal(200);
    
    // Verificar que retorna un token
    expect(interception.response.body).to.have.property('token');
    expect(interception.response.body.token).to.be.a('string');
  });
});
```

### Simular Respuestas (Mocking)

```typescript
describe('Manejo de Errores', () => {
  
  it('debería mostrar error cuando falla la carga de productos', () => {
    // Simular un error 500
    cy.intercept('GET', '**/api/products*', {
      statusCode: 500,
      body: {
        error: 'Error interno del servidor'
      }
    }).as('getProductsError');
    
    cy.visit('/productos');
    
    cy.wait('@getProductsError');
    
    // Verificar que muestra el mensaje de error
    cy.get('[data-cy="error-message"]')
      .should('be.visible')
      .and('contain', 'Error al cargar productos');
  });
  
  it('debería manejar respuesta vacía', () => {
    // Simular respuesta sin productos
    cy.intercept('GET', '**/api/products*', {
      statusCode: 200,
      body: {
        products: [],
        pagination: {
          totalResults: 0
        }
      }
    }).as('getProducts');
    
    cy.visit('/productos');
    
    cy.wait('@getProducts');
    
    // Verificar mensaje de "sin productos"
    cy.get('[data-cy="empty-state"]')
      .should('be.visible')
      .and('contain', 'No hay productos disponibles');
  });
});
```

### Simular Datos de Prueba

```typescript
describe('Detalle de Producto', () => {
  
  it('debería mostrar la información completa del producto', () => {
    // Datos de prueba
    const productoMock = {
      id: '123',
      name: 'Laptop Gaming XYZ',
      description: 'Laptop de alto rendimiento',
      price: 1299.99,
      stock: 5,
      imageUrl: 'https://ejemplo.com/laptop.jpg',
      category: {
        id: 'cat1',
        name: 'Laptops'
      }
    };
    
    // Interceptar y retornar datos mock
    cy.intercept('GET', '**/api/products/123', {
      statusCode: 200,
      body: productoMock
    }).as('getProduct');
    
    cy.visit('/productos/123');
    
    cy.wait('@getProduct');
    
    // Verificar que muestra todos los datos
    cy.get('[data-cy="product-name"]').should('contain', productoMock.name);
    cy.get('[data-cy="product-description"]').should('contain', productoMock.description);
    cy.get('[data-cy="product-price"]').should('contain', '$1,299.99');
    cy.get('[data-cy="product-stock"]').should('contain', '5');
    cy.get('[data-cy="product-image"]').should('have.attr', 'src', productoMock.imageUrl);
  });
});
```

---

## Ejemplos Prácticos Completos

### Ejemplo 1: Registro y Login Completo

```typescript
// cypress/e2e/auth/register-and-login.cy.ts

describe('Flujo Completo: Registro y Login', () => {
  
  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    cy.clearLocalStorage();
  });

  it('debería registrar un usuario nuevo y luego hacer login', () => {
    // ===== DATOS DE PRUEBA =====
    const timestamp = Date.now();
    const nuevoUsuario = {
      displayName: `Usuario Test ${timestamp}`,
      email: `test${timestamp}@ejemplo.com`,
      phone: '1234567890',
      dateOfBirth: '1990-01-15',
      password: 'Test123456!'
    };

    // ===== PASO 1: INTERCEPTAR PETICIONES =====
    cy.intercept('POST', '**/api/auth/register').as('registerRequest');
    cy.intercept('POST', '**/api/auth/login').as('loginRequest');

    // ===== PASO 2: IR A PÁGINA DE REGISTRO =====
    cy.visit('/register');

    // Verificar que estamos en la página correcta
    cy.url().should('include', '/register');
    cy.get('h1').should('contain', 'Registro');

    // ===== PASO 3: LLENAR FORMULARIO DE REGISTRO =====
    cy.get('[data-cy="displayName-input"]')
      .should('be.visible')
      .type(nuevoUsuario.displayName);
    
    cy.get('[data-cy="email-input"]')
      .should('be.visible')
      .type(nuevoUsuario.email);
    
    cy.get('[data-cy="phone-input"]')
      .should('be.visible')
      .type(nuevoUsuario.phone);
    
    cy.get('[data-cy="dateOfBirth-input"]')
      .should('be.visible')
      .type(nuevoUsuario.dateOfBirth);
    
    cy.get('[data-cy="password-input"]')
      .should('be.visible')
      .type(nuevoUsuario.password);
    
    cy.get('[data-cy="repeatPassword-input"]')
      .should('be.visible')
      .type(nuevoUsuario.password);

    // ===== PASO 4: VERIFICAR QUE EL BOTÓN ESTÉ HABILITADO =====
    cy.get('[data-cy="submit-button"]').should('not.be.disabled');

    // ===== PASO 5: ENVIAR FORMULARIO =====
    cy.get('[data-cy="submit-button"]').click();

    // ===== PASO 6: ESPERAR RESPUESTA DE REGISTRO =====
    cy.wait('@registerRequest').then((interception) => {
      // Verificar que se envió la petición
      expect(interception.request.body).to.have.property('email', nuevoUsuario.email);
      
      // Verificar respuesta exitosa
      expect(interception.response).to.not.be.undefined;
      expect(interception.response.statusCode).to.equal(201);
    });

    // ===== PASO 7: VERIFICAR REDIRECCIÓN A LOGIN =====
    cy.url().should('include', '/login');

    // ===== PASO 8: HACER LOGIN CON EL USUARIO RECIÉN CREADO =====
    cy.get('[data-cy="email-input"]')
      .should('be.visible')
      .type(nuevoUsuario.email);
    
    cy.get('[data-cy="password-input"]')
      .should('be.visible')
      .type(nuevoUsuario.password);
    
    cy.get('[data-cy="submit-button"]')
      .should('not.be.disabled')
      .click();

    // ===== PASO 9: ESPERAR RESPUESTA DE LOGIN =====
    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response).to.not.be.undefined;
      expect(interception.response.statusCode).to.equal(200);
      expect(interception.response.body).to.have.property('token');
    });

    // ===== PASO 10: VERIFICAR QUE ESTÁ LOGUEADO =====
    // La URL ya no debería incluir '/login'
    cy.url().should('not.include', '/login');
    
    // Debería haber un token en localStorage
    cy.window().then(win => {
      const token = win.localStorage.getItem('token');
      expect(token).to.not.be.null;
      expect(token).to.be.a('string');
    });

    // Debería mostrar el nombre del usuario
    cy.get('[data-cy="user-menu"]')
      .should('be.visible')
      .and('contain', nuevoUsuario.displayName);
  });
});
```

### Ejemplo 2: Flujo de Compra Completo

```typescript
// cypress/e2e/shopping/complete-purchase.cy.ts

describe('Flujo Completo de Compra', () => {
  
  beforeEach(() => {
    // Login antes de cada prueba
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type('usuario@ejemplo.com');
    cy.get('[data-cy="password-input"]').type('Password123!');
    cy.get('[data-cy="submit-button"]').click();
    cy.url().should('not.include', '/login');
  });

  it('debería permitir comprar un producto de principio a fin', () => {
    
    // ===== PASO 1: INTERCEPTAR PETICIONES =====
    cy.intercept('GET', '**/api/products*').as('getProducts');
    cy.intercept('POST', '**/api/cart/add-product').as('addToCart');
    cy.intercept('GET', '**/api/cart').as('getCart');
    cy.intercept('POST', '**/api/orders').as('createOrder');

    // ===== PASO 2: IR A PRODUCTOS =====
    cy.visit('/productos');
    cy.wait('@getProducts');

    // Verificar que cargaron productos
    cy.get('[data-cy="product-card"]')
      .should('have.length.at.least', 1);

    // ===== PASO 3: SELECCIONAR UN PRODUCTO =====
    cy.get('[data-cy="product-card"]')
      .first()
      .within(() => {
        // Guardar el nombre y precio para verificar después
        cy.get('[data-cy="product-name"]')
          .invoke('text')
          .as('productName');
        
        cy.get('[data-cy="product-price"]')
          .invoke('text')
          .as('productPrice');
        
        // Agregar al carrito
        cy.get('[data-cy="add-to-cart-btn"]').click();
      });

    // ===== PASO 4: ESPERAR QUE SE AGREGUE AL CARRITO =====
    cy.wait('@addToCart').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    // ===== PASO 5: VERIFICAR INDICADOR DE CARRITO =====
    cy.get('[data-cy="cart-badge"]')
      .should('be.visible')
      .and('contain', '1');

    // ===== PASO 6: IR AL CARRITO =====
    cy.get('[data-cy="cart-icon"]').click();
    cy.url().should('include', '/carrito');
    cy.wait('@getCart');

    // ===== PASO 7: VERIFICAR PRODUCTO EN CARRITO =====
    cy.get('[data-cy="cart-item"]')
      .should('have.length', 1);

    cy.get('@productName').then((nombre) => {
      cy.get('[data-cy="cart-item-name"]')
        .should('contain', nombre);
    });

    cy.get('@productPrice').then((precio) => {
      cy.get('[data-cy="cart-item-price"]')
        .should('contain', precio);
    });

    // ===== PASO 8: PROCEDER AL CHECKOUT =====
    cy.get('[data-cy="checkout-button"]')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    cy.url().should('include', '/checkout');

    // ===== PASO 9: LLENAR INFORMACIÓN DE ENVÍO =====
    cy.get('[data-cy="address-input"]')
      .type('Calle Principal 123');
    
    cy.get('[data-cy="city-input"]')
      .type('Ciudad de México');
    
    cy.get('[data-cy="zipcode-input"]')
      .type('12345');

    // ===== PASO 10: SELECCIONAR MÉTODO DE PAGO =====
    cy.get('[data-cy="payment-method"]')
      .select('Tarjeta de Crédito');

    // ===== PASO 11: FINALIZAR COMPRA =====
    cy.get('[data-cy="place-order-button"]')
      .should('not.be.disabled')
      .click();

    // ===== PASO 12: ESPERAR CONFIRMACIÓN =====
    cy.wait('@createOrder').then((interception) => {
      expect(interception.response.statusCode).to.equal(201);
      expect(interception.response.body).to.have.property('orderId');
    });

    // ===== PASO 13: VERIFICAR PÁGINA DE ÉXITO =====
    cy.url().should('include', '/order-success');
    
    cy.get('[data-cy="success-message"]')
      .should('be.visible')
      .and('contain', 'Compra realizada exitosamente');
    
    cy.get('[data-cy="order-number"]')
      .should('be.visible');

    // ===== PASO 14: VERIFICAR QUE EL CARRITO ESTÁ VACÍO =====
    cy.get('[data-cy="cart-badge"]')
      .should('not.exist');
  });
});
```

### Ejemplo 3: Búsqueda de Productos

```typescript
// cypress/e2e/products/search.cy.ts

describe('Búsqueda de Productos', () => {
  
  beforeEach(() => {
    cy.visit('/productos');
  });

  it('debería buscar productos por nombre', () => {
    // Interceptar petición de búsqueda
    cy.intercept('GET', '**/api/products?search=*').as('searchProducts');

    // Escribir en el buscador
    cy.get('[data-cy="search-input"]')
      .should('be.visible')
      .type('laptop');

    // Esperar a que termine la búsqueda
    cy.wait('@searchProducts');

    // Verificar resultados
    cy.get('[data-cy="product-card"]')
      .should('have.length.at.least', 1);

    // Todos los resultados deberían contener "laptop"
    cy.get('[data-cy="product-name"]')
      .each(($el) => {
        cy.wrap($el)
          .invoke('text')
          .should('match', /laptop/i);
      });
  });

  it('debería mostrar mensaje cuando no hay resultados', () => {
    cy.intercept('GET', '**/api/products?search=*', {
      statusCode: 200,
      body: {
        products: [],
        pagination: {
          totalResults: 0
        }
      }
    }).as('searchProducts');

    cy.get('[data-cy="search-input"]')
      .type('productoinexistente123');

    cy.wait('@searchProducts');

    cy.get('[data-cy="no-results-message"]')
      .should('be.visible')
      .and('contain', 'No se encontraron productos');
  });

  it('debería limpiar la búsqueda', () => {
    // Hacer una búsqueda
    cy.get('[data-cy="search-input"]').type('laptop');
    cy.get('[data-cy="product-card"]').should('exist');

    // Limpiar búsqueda
    cy.get('[data-cy="clear-search-btn"]').click();

    // El input debería estar vacío
    cy.get('[data-cy="search-input"]').should('have.value', '');

    // Debería mostrar todos los productos nuevamente
    cy.get('[data-cy="product-card"]')
      .should('have.length.at.least', 1);
  });
});
```

---

## Ejecutando las Pruebas

### Modo Interactivo (Desarrollo)

```bash
# Inicia tu app Angular y abre Cypress
npm run e2e:open
```

**O manualmente**:

```bash
# Terminal 1: Iniciar Angular
npm start

# Terminal 2: Abrir Cypress
npx cypress open
```

**Qué verás**:
1. Se abre una ventana de Cypress
2. Ves lista de tus archivos de prueba
3. Haces clic en uno
4. Se abre un navegador
5. Ves cada paso de la prueba ejecutándose

**Ventajas del modo interactivo**:
- Ves exactamente qué está pasando
- Puedes pausar y debuggear
- Puedes hacer "time travel" (ver estados anteriores)
- Puedes inspeccionar el DOM en cualquier momento

### Modo Headless (CI/CD)

```bash
# Ejecuta todas las pruebas sin interfaz gráfica
npm run cypress:run
```

**Qué hace**:
1. Ejecuta todas las pruebas automáticamente
2. Genera videos de las pruebas
3. Genera screenshots de errores
4. Muestra un resumen en la terminal

**Salida en terminal**:

```
Running:  login.cy.ts                                                         (1 of 3)

  Sistema de Login
    ✓ debería permitir login con credenciales correctas (1542ms)
    ✓ debería mostrar error con credenciales incorrectas (856ms)
    ✓ debería desabilitar el botón si faltan campos (123ms)

  3 passing (3s)

  (Results)

  Tests:        3 passing
  Duration:     3s
  Screenshots:  0 taken
  Video:        true
```

### Ejecutar Pruebas Específicas

```bash
# Solo un archivo
npx cypress run --spec "cypress/e2e/login.cy.ts"

# Archivos que coincidan con un patrón
npx cypress run --spec "cypress/e2e/auth/*.cy.ts"

# En un navegador específico
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge
```

### Ver Resultados

**Videos**: Se guardan en `cypress/videos/`
- Un video por archivo de prueba
- Solo se graban en modo headless
- Útiles para ver qué pasó cuando algo falla

**Screenshots**: Se guardan en `cypress/screenshots/`
- Se toman automáticamente cuando una prueba falla
- Muestran exactamente el estado cuando falló
- El nombre incluye el test que falló

---

## Mejores Prácticas

### 1. Usa data-cy para Selectores

```typescript
// ❌ Evitar
cy.get('.btn-primary').click();
cy.get('#submit').click();
cy.contains('Guardar').click();

// ✅ Mejor
cy.get('[data-cy="submit-button"]').click();
```

### 2. No Uses Esperas Fijas

```typescript
// ❌ Evitar - hace las pruebas lentas
cy.wait(3000);
cy.get('button').click();

// ✅ Mejor - Cypress espera automáticamente
cy.get('button').click();

// ✅ Mejor - Esperar peticiones HTTP
cy.intercept('GET', '/api/data').as('getData');
cy.wait('@getData');
```

### 3. Usa beforeEach para Configuración Común

```typescript
// ❌ Evitar - repetir código
it('prueba 1', () => {
  cy.visit('/login');
  cy.clearLocalStorage();
  // ... resto de la prueba
});

it('prueba 2', () => {
  cy.visit('/login');
  cy.clearLocalStorage();
  // ... resto de la prueba
});

// ✅ Mejor - usar beforeEach
describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.clearLocalStorage();
  });

  it('prueba 1', () => {
    // ... solo la lógica específica
  });

  it('prueba 2', () => {
    // ... solo la lógica específica
  });
});
```

### 4. Una Prueba, Un Concepto

```typescript
// ❌ Evitar - prueba demasiado en una sola prueba
it('todo el flujo de la app', () => {
  // registro
  // login
  // agregar producto
  // checkout
  // etc... (demasiado)
});

// ✅ Mejor - dividir en pruebas específicas
it('debería permitir registro', () => { /* ... */ });
it('debería permitir login', () => { /* ... */ });
it('debería agregar producto al carrito', () => { /* ... */ });
it('debería completar el checkout', () => { /* ... */ });
```

### 5. Pruebas Independientes

```typescript
// ❌ Evitar - pruebas que dependen unas de otras
it('crear usuario', () => {
  // crea usuario "test@ejemplo.com"
});

it('hacer login', () => {
  // usa el usuario creado en la prueba anterior
  cy.get('input[type="email"]').type('test@ejemplo.com');
});

// ✅ Mejor - cada prueba es independiente
describe('Auth', () => {
  const usuario = {
    email: `test${Date.now()}@ejemplo.com`,
    password: 'Test123!'
  };

  it('crear usuario', () => {
    // crea usuario nuevo
  });

  it('hacer login', () => {
    // crea su propio usuario o usa un fixture
    const loginUser = {
      email: 'login@ejemplo.com',
      password: 'Password123!'
    };
    // ... prueba de login
  });
});
```

### 6. Usar Aliases para Elementos Reutilizables

```typescript
// ✅ Usar alias para elementos que usarás varias veces
beforeEach(() => {
  cy.get('[data-cy="email-input"]').as('emailInput');
  cy.get('[data-cy="password-input"]').as('passwordInput');
  cy.get('[data-cy="submit-button"]').as('submitButton');
});

it('debería hacer login', () => {
  cy.get('@emailInput').type('user@ejemplo.com');
  cy.get('@passwordInput').type('Password123!');
  cy.get('@submitButton').click();
});
```

### 7. Agrupar Verificaciones Relacionadas

```typescript
// ✅ Agrupar verificaciones relacionadas
cy.get('[data-cy="product-card"]')
  .should('be.visible')
  .and('contain', 'Laptop')
  .and('have.class', 'in-stock')
  .within(() => {
    cy.get('[data-cy="product-price"]').should('contain', '$999');
    cy.get('[data-cy="product-rating"]').should('contain', '4.5');
  });
```

---

## Errores Comunes y Soluciones

### Error 1: "Element is detached from the DOM"

**Problema**:
```typescript
cy.get('button').click();
// La página se recarga
cy.get('div').should('be.visible'); // ❌ Falla
```

**Solución**:
```typescript
cy.get('button').click();
// Esperar a que la página esté lista
cy.url().should('include', '/nueva-pagina');
cy.get('div').should('be.visible'); // ✅ Funciona
```

### Error 2: "Timed out retrying: Expected to find element"

**Problema**: El elemento no existe o tarda mucho en aparecer

**Soluciones**:

```typescript
// Solución 1: Aumentar timeout
cy.get('[data-cy="slow-element"]', { timeout: 10000 })
  .should('exist');

// Solución 2: Esperar una condición previa
cy.get('[data-cy="loading-spinner"]').should('not.exist');
cy.get('[data-cy="content"]').should('exist');

// Solución 3: Verificar el selector
// Asegúrate de que data-cy está en el HTML
cy.get('[data-cy="elemento-correcto"]');
```

### Error 3: "Element is disabled"

**Problema**: Intentas interactuar con un elemento deshabilitado

**Soluciones**:

```typescript
// Solución 1: Esperar a que se habilite
cy.get('button')
  .should('not.be.disabled')
  .click();

// Solución 2: Verificar qué lo mantiene deshabilitado
// Llenar campos requeridos primero
cy.get('[data-cy="email-input"]').type('email@ejemplo.com');
cy.get('[data-cy="password-input"]').type('Password123!');
// Ahora el botón debería estar habilitado
cy.get('button').should('not.be.disabled').click();
```

### Error 4: "CypressError: cy.click() failed because this element is being covered"

**Problema**: Hay otro elemento encima (modal, tooltip, etc.)

**Soluciones**:

```typescript
// Solución 1: Cerrar lo que cubre
cy.get('[data-cy="modal-close"]').click();
cy.get('[data-cy="target-button"]').click();

// Solución 2: Forzar el click (usar con cuidado)
cy.get('[data-cy="target-button"]').click({ force: true });

// Solución 3: Esperar a que se quite lo que cubre
cy.get('[data-cy="overlay"]').should('not.exist');
cy.get('[data-cy="target-button"]').click();
```

### Error 5: "No request ever occurred"

**Problema**: La petición interceptada nunca se hizo

```typescript
// ❌ Problema
cy.intercept('GET', '/api/products').as('getProducts');
cy.visit('/productos');
cy.wait('@getProducts'); // Falla si la URL no es exacta
```

**Soluciones**:

```typescript
// Solución 1: Usar patrón más flexible
cy.intercept('GET', '**/api/products*').as('getProducts');

// Solución 2: Verificar la URL exacta en DevTools
// y ajustar el intercept

// Solución 3: Verificar que la petición se hace
// Abrir DevTools Network y ver la petición real
```

---

## Comandos Personalizados

Puedes crear tus propios comandos para reutilizar código común.

**En `cypress/support/commands.ts`**:

```typescript
// Declarar tipos
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      addProductToCart(productId: string): Chainable<void>;
    }
  }
}

// Comando personalizado para login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-cy="email-input"]').type(email);
  cy.get('[data-cy="password-input"]').type(password);
  cy.get('[data-cy="submit-button"]').click();
  cy.url().should('not.include', '/login');
});

// Comando personalizado para agregar al carrito
Cypress.Commands.add('addProductToCart', (productId: string) => {
  cy.intercept('POST', '**/api/cart/add-product').as('addToCart');
  cy.get(`[data-cy="product-${productId}"]`)
    .find('[data-cy="add-to-cart-btn"]')
    .click();
  cy.wait('@addToCart');
});
```

**Usar en tus pruebas**:

```typescript
describe('Carrito de Compras', () => {
  
  beforeEach(() => {
    // Usar comando personalizado
    cy.login('usuario@ejemplo.com', 'Password123!');
  });

  it('debería agregar múltiples productos', () => {
    cy.visit('/productos');
    
    // Usar comandos personalizados
    cy.addProductToCart('prod-1');
    cy.addProductToCart('prod-2');
    cy.addProductToCart('prod-3');
    
    cy.get('[data-cy="cart-count"]').should('contain', '3');
  });
});
```

---

## Fixtures: Datos de Prueba Reutilizables

Los fixtures son archivos JSON con datos de prueba.

**Crear fixture `cypress/fixtures/usuarios.json`**:

```json
{
  "usuarioValido": {
    "email": "usuario@ejemplo.com",
    "password": "Password123!",
    "displayName": "Usuario Prueba"
  },
  "usuarioInvalido": {
    "email": "invalido@ejemplo.com",
    "password": "wrongpassword"
  },
  "nuevoUsuario": {
    "displayName": "Nuevo Usuario",
    "email": "nuevo@ejemplo.com",
    "phone": "1234567890",
    "dateOfBirth": "1990-01-01",
    "password": "Test123456!"
  }
}
```

**Usar en pruebas**:

```typescript
describe('Login', () => {
  
  it('debería hacer login con usuario válido', () => {
    cy.fixture('usuarios').then((usuarios) => {
      const user = usuarios.usuarioValido;
      
      cy.visit('/login');
      cy.get('[data-cy="email-input"]').type(user.email);
      cy.get('[data-cy="password-input"]').type(user.password);
      cy.get('[data-cy="submit-button"]').click();
      
      cy.get('[data-cy="user-name"]').should('contain', user.displayName);
    });
  });
  
  it('debería rechazar usuario inválido', () => {
    cy.fixture('usuarios').then((usuarios) => {
      const user = usuarios.usuarioInvalido;
      
      cy.visit('/login');
      cy.get('[data-cy="email-input"]').type(user.email);
      cy.get('[data-cy="password-input"]').type(user.password);
      cy.get('[data-cy="submit-button"]').click();
      
      cy.get('[data-cy="error-message"]').should('be.visible');
    });
  });
});
```

---
