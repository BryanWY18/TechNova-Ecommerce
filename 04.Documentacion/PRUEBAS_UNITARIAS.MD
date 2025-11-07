# Guía Completa de Pruebas Unitarias con Jest

**Documentación oficial de Jest**: https://jestjs.io/

---

## Tabla de Contenidos

1. [¿Qué son las Pruebas Unitarias?](#qué-son-las-pruebas-unitarias)
2. [Jest: Tu Herramienta de Pruebas](#jest-tu-herramienta-de-pruebas)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Anatomía de una Prueba](#anatomía-de-una-prueba)
5. [Mocking: Simulando Dependencias](#mocking-simulando-dependencias)
6. [Pruebas Asíncronas](#pruebas-asíncronas)
7. [Ejemplo Completo](#ejemplo-completo-probando-un-sistema-de-autenticación)
8. [Ejecutando las Pruebas](#ejecutando-las-pruebas)
9. [Mejores Prácticas](#mejores-prácticas)
10. [Errores Comunes](#errores-comunes-y-cómo-evitarlos)

---

## ¿Qué son las Pruebas Unitarias?

### El Problema que Resuelven

Imagina que construyes una casa. Después de terminar, ¿esperas hasta que alguien viva en ella para descubrir que las puertas no abren o que el agua no sale de las llaves? ¡Claro que no! Pruebas cada parte durante la construcción.

Lo mismo pasa con el código. Las pruebas unitarias son como esos chequeos que haces durante la construcción: verifican que cada pieza de tu código funcione correctamente **antes** de que alguien la use.

### ¿Qué es una "Unidad"?

Una "unidad" es la parte más pequeña y testeable de tu código. Generalmente es:

- Una función que hace algo específico
- Un método de una clase
- Un componente de Angular
- Un servicio que maneja datos

**Ejemplo simple**:

```javascript
// Esta función es una "unidad"
function sumar(a, b) {
  return a + b;
}

// Así probarías que funciona
console.log(sumar(2, 3)); // Esperas que sea 5
console.log(sumar(10, -5)); // Esperas que sea 5
```

### Beneficios de las Pruebas Unitarias

#### 1. Detectan Errores Temprano

```javascript
// Sin pruebas: descubres el error cuando un usuario se queja
function calcularDescuento(precio, descuento) {
  return precio - (precio * descuento); // Bug: no divide entre 100
}

// Con pruebas: descubres el error inmediatamente
it('debería calcular el descuento correctamente', () => {
  expect(calcularDescuento(100, 10)).toBe(90); // Falla y te das cuenta del error
});
```

#### 2. Documentan tu Código

Las pruebas son como instrucciones que explican qué hace tu código:

```javascript
describe('Sistema de Carrito de Compras', () => {
  it('debería agregar productos al carrito', () => {
    // Alguien que lea esto sabe qué hace la función
  });

  it('debería calcular el total correctamente', () => {
    // Otra persona entiende el comportamiento esperado
  });

  it('debería aplicar descuentos', () => {
    // Documenta funcionalidades sin leer el código fuente
  });
});
```

#### 3. Facilitan Cambios Seguros

```javascript
// Tienes código funcionando
function procesarPago(monto) {
  // lógica compleja
  return resultado;
}

// Quieres mejorarlo pero temes romper algo
// Con pruebas: haces cambios y ejecutas las pruebas
// Si pasan, todo sigue funcionando bien
```

---

## Jest: Tu Herramienta de Pruebas

Jest es un framework de pruebas desarrollado por Facebook. Piénsalo como un laboratorio completo donde puedes probar tu código de manera automática.

### ¿Por Qué Jest?

- **Todo en uno**: No necesitas instalar múltiples herramientas
- **Fácil de usar**: Sintaxis simple y clara
- **Rápido**: Ejecuta pruebas en paralelo
- **Reportes claros**: Te dice exactamente qué falló y dónde
- **Mocking integrado**: Simula partes complejas fácilmente

---

## Instalación y Configuración

### Para Proyectos de Node.js (Backend)

```bash
# Iniciar proyecto si no existe
npm init -y

# Instalar Jest
npm install --save-dev jest

# Si usas ES6 modules (import/export)
npm install --save-dev @babel/preset-env
```

### Configuración Básica

#### 1. Modificar package.json

```json
{
  "name": "mi-proyecto",
  "version": "1.0.0",
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "type": "module"
}
```

#### 2. Crear jest.config.js

Este archivo le dice a Jest cómo debe comportarse:

```javascript
export default {
  // Usa el entorno de Node.js (no navegador)
  testEnvironment: 'node',
  
  // Permite usar import/export modernos
  transform: {},
  
  // Qué archivos buscar como pruebas
  // Busca archivos que terminen en .test.js o .spec.js
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Carpetas a ignorar
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  
  // Generar reporte de cobertura
  collectCoverage: false,
  
  // Dónde guardar el reporte
  coverageDirectory: 'coverage',
  
  // Qué archivos incluir en el reporte
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ]
};
```

#### 3. Si usas Babel (para import/export)

Crear `.babelrc`:

```json
{
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "node": "current"
      }
    }]
  ]
}
```

---

## Anatomía de una Prueba

### Estructura Básica

Toda prueba sigue este patrón de tres pasos (AAA Pattern):

```javascript
it('descripción de lo que prueba', () => {
  // 1. ARRANGE (Preparar): Configura todo lo necesario
  const numero1 = 5;
  const numero2 = 3;
  
  // 2. ACT (Actuar): Ejecuta la función que estás probando
  const resultado = sumar(numero1, numero2);
  
  // 3. ASSERT (Afirmar): Verifica que el resultado sea correcto
  expect(resultado).toBe(8);
});
```

### Componentes de una Prueba

#### describe - Agrupar Pruebas Relacionadas

`describe` crea un "bloque" que agrupa pruebas relacionadas:

```javascript
// describe('nombre del grupo', función con las pruebas)
describe('Calculadora', () => {
  // Todas las pruebas de la calculadora van aquí
  
  it('debería sumar dos números', () => {
    expect(sumar(2, 3)).toBe(5);
  });

  it('debería restar dos números', () => {
    expect(restar(5, 3)).toBe(2);
  });

  it('debería multiplicar dos números', () => {
    expect(multiplicar(2, 3)).toBe(6);
  });
});
```

**Puedes anidar describe para mejor organización**:

```javascript
describe('Sistema de Usuarios', () => {
  
  describe('Registro', () => {
    it('debería crear un usuario nuevo', () => {});
    it('debería validar el email', () => {});
    it('debería hashear la contraseña', () => {});
  });

  describe('Login', () => {
    it('debería permitir login con credenciales válidas', () => {});
    it('debería rechazar login con contraseña incorrecta', () => {});
  });

  describe('Perfil', () => {
    it('debería actualizar información del usuario', () => {});
    it('debería cambiar la contraseña', () => {});
  });
});
```

#### it - Definir una Prueba Individual

`it` (o `test`, son sinónimos) define una prueba específica:

```javascript
// it('descripción legible de lo que prueba', función de prueba)
it('debería validar que el email tenga formato correcto', () => {
  const emailValido = validarEmail('usuario@example.com');
  const emailInvalido = validarEmail('emailincorrecto');
  
  expect(emailValido).toBe(true);
  expect(emailInvalido).toBe(false);
});
```

**Convención de nombres**: Escribe descripciones claras que cualquiera pueda entender sin ver el código:

```javascript
// ✅ Bueno - describe comportamiento
it('debería rechazar usuarios menores de 18 años', () => {});

// ❌ Malo - muy técnico
it('validarEdad función retorna false', () => {});

// ✅ Bueno - específico
it('debería mostrar mensaje de error cuando el email está vacío', () => {});

// ❌ Malo - vago
it('maneja errores', () => {});
```

#### expect - Hacer Afirmaciones

`expect` es como decirle a Jest: "Espero que esto sea verdad":

```javascript
// Verificar valores exactos
expect(resultado).toBe(5); // Valores primitivos (números, strings, booleans)  

// Verificar objetos
expect(usuario).toEqual({ 
  nombre: 'Juan', 
  edad: 25 
}); // Objetos y arrays

// Verificar que algo sea verdadero/falso  
expect(esMayorDeEdad).toBeTruthy();  
expect(tieneDescuento).toBeFalsy();  

// Verificar que algo exista  
expect(usuario).toBeDefined();  
expect(productoAgotado).toBeNull();  

// Verificar que un array contenga algo  
expect([1, 2, 3]).toContain(2);

// Verificar números
expect(precio).toBeGreaterThan(0);  
expect(descuento).toBeLessThan(100);

// Verificar strings
expect(mensaje).toMatch(/error/i); // Expresión regular

// Verificar que algo lance un error
expect(() => dividir(5, 0)).toThrow();
```

### beforeEach y afterEach - Preparación y Limpieza

Estas funciones se ejecutan antes o después de cada prueba. Son útiles para evitar repetir código:

```javascript
describe('Carrito de Compras', () => {
  let carrito;

  // Se ejecuta ANTES de cada prueba
  beforeEach(() => {
    // Crea un carrito nuevo para cada prueba
    carrito = new Carrito();
    console.log('Preparando nuevo carrito');
  });

  // Se ejecuta DESPUÉS de cada prueba
  afterEach(() => {
    // Limpia el carrito después de cada prueba
    carrito = null;
    console.log('Limpiando carrito');
  });

  it('debería estar vacío inicialmente', () => {  
    expect(carrito.items).toEqual([]);
  });

  it('debería agregar un producto', () => {
    carrito.agregarProducto({ id: 1, nombre: 'Laptop' });
    expect(carrito.items.length).toBe(1);
  });
});

// Salida de consola:
// Preparando nuevo carrito
// ✓ debería estar vacío inicialmente
// Limpiando carrito

// Preparando nuevo carrito
// ✓ debería agregar un producto  
// Limpiando carrito
```

**También existen beforeAll y afterAll**:

```javascript
describe('Base de Datos', () => {
  
  // Se ejecuta UNA VEZ antes de todas las pruebas
  beforeAll(async () => {
    await conectarBaseDeDatos();
    console.log('Conexión establecida');
  });

  // Se ejecuta UNA VEZ después de todas las pruebas
  afterAll(async () => {
    await cerrarBaseDeDatos();
    console.log('Conexión cerrada');
  });

  it('debería crear un usuario', async () => {
    // usa la conexión establecida en beforeAll
  });

  it('debería leer un usuario', async () => {
    // usa la misma conexión
  });
});
```

---

## Mocking: Simulando Dependencias

### ¿Qué es un Mock y Por Qué lo Necesitas?

Un mock es una "falsificación" de algo. Imagina que estás probando una función que envía emails. No quieres enviar emails reales cada vez que ejecutas las pruebas. En su lugar, usas un mock que "simula" enviar el email.

### Mocking de Funciones

```javascript
// Función que queremos probar
function notificarUsuario(usuario, servicio) {
  servicio.enviarEmail(usuario.email, 'Bienvenido');
  return true;
}

// Prueba con mock
it('debería enviar email de bienvenida', () => {
  // Crear un mock del servicio de email
  const servicioEmail = {
    enviarEmail: jest.fn() // Jest crea una función falsa
  };

  const usuario = { email: 'juan@example.com' };

  // Ejecutar la función
  notificarUsuario(usuario, servicioEmail);

  // Verificar que se llamó al servicio de email
  expect(servicioEmail.enviarEmail).toHaveBeenCalled();
  expect(servicioEmail.enviarEmail).toHaveBeenCalledWith(
    'juan@example.com',
    'Bienvenido'
  );
});
```

### Mocking de Módulos Completos

```javascript
// Supongamos que tienes un módulo de base de datos
// src/database.js
export function guardarUsuario(usuario) {
  // código real que conecta a la base de datos
}

// En tu prueba
import { guardarUsuario } from './database.js';

// Mock del módulo completo
jest.mock('./database.js', () => ({
  guardarUsuario: jest.fn()
}));

it('debería llamar a guardarUsuario', () => {
  const usuario = { nombre: 'Juan' };
  
  // Usar la función mockeada
  guardarUsuario(usuario);
  
  // Verificar que se llamó
  expect(guardarUsuario).toHaveBeenCalledWith(usuario);
});
```

### Controlar el Valor de Retorno de un Mock

```javascript
it('debería manejar respuesta de la API', async () => {
  // Crear un mock que retorna un valor específico
  const apiService = {
    obtenerDatos: jest.fn().mockResolvedValue({
      status: 'success',
      data: [1, 2, 3]
    })
  };

  // Usar el mock
  const resultado = await apiService.obtenerDatos();
  
  expect(resultado.status).toBe('success');
  expect(resultado.data).toEqual([1, 2, 3]);
});
```

---

## Pruebas Asíncronas

Muchas veces tu código hace operaciones que toman tiempo (llamadas a APIs, lectura de archivos, etc.). Jest tiene formas de probar este código:

### Usando async/await (Recomendado)

```javascript
// Función asíncrona que queremos probar
async function obtenerUsuario(id) {
  const respuesta = await fetch(`/api/users/${id}`);
  return respuesta.json();
}

// Prueba con async/await
it('debería obtener datos del usuario', async () => {
  // La prueba también debe ser async
  const usuario = await obtenerUsuario(1);
  
  expect(usuario).toBeDefined();
  expect(usuario.id).toBe(1);
});
```

### Usando Promesas

```javascript
it('debería obtener datos del usuario', () => {
  // Retornar la promesa
  return obtenerUsuario(1).then(usuario => {
    expect(usuario).toBeDefined();
    expect(usuario.id).toBe(1);
  });
});
```

### Probando Errores Asíncronos

```javascript
it('debería manejar errores de la API', async () => {
  // Mock que simula un error
  const apiService = {
    obtenerDatos: jest.fn().mockRejectedValue(
      new Error('Error de red')
    )
  };

  // Esperar que lance un error
  await expect(apiService.obtenerDatos())
    .rejects
    .toThrow('Error de red');
});
```

---

## Ejemplo Completo: Probando un Sistema de Autenticación

### El Código a Probar

```javascript
// src/auth/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export async function register(userData) {
  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ email: userData.email });
  
  if (existingUser) {
    throw new Error('El email ya está registrado');
  }

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Crear nuevo usuario
  const newUser = new User({
    displayName: userData.displayName,
    email: userData.email,
    password: hashedPassword,
    role: 'customer'
  });

  await newUser.save();

  return {
    displayName: newUser.displayName,
    email: newUser.email
  };
}

export async function login(credentials) {
  // Buscar usuario
  const user = await User.findOne({ email: credentials.email });
  
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Verificar contraseña
  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error('Contraseña incorrecta');
  }

  // Generar token
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token };
}
```

### Las Pruebas con Explicación Detallada

```javascript
// src/auth/__tests__/authController.test.js
import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/user.js';
import { register, login } from '../authController.js';

// Agrupar todas las pruebas de autenticación
describe('Sistema de Autenticación', () => {

  // Limpiar todos los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* ==========================================
     PRUEBAS DE REGISTRO
     ========================================== */
  
  describe('Registro de Usuarios', () => {

    it('debería registrar un nuevo usuario exitosamente', async () => {
      // ===== PASO 1: PREPARAR (Arrange) =====
      // Crear datos de usuario de prueba
      const nuevoUsuario = {
        displayName: 'María García',
        email: 'maria@example.com',
        password: 'password123'
      };

      // Simular que NO existe un usuario con ese email
      // (para que pueda registrarse)
      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      
      // Simular el hasheo de la contraseña
      jest.spyOn(bcrypt, 'hash')
        .mockResolvedValue('contraseña_hasheada_falsa');
      
      // Simular que el usuario se guarda correctamente
      const mockSave = jest.fn().mockResolvedValue({
        _id: 'user123',
        displayName: nuevoUsuario.displayName,
        email: nuevoUsuario.email,
        role: 'customer'
      });
      
      jest.spyOn(User.prototype, 'save')
        .mockImplementation(mockSave);

      // ===== PASO 2: ACTUAR (Act) =====
      // Ejecutar la función de registro
      const resultado = await register(nuevoUsuario);

      // ===== PASO 3: AFIRMAR (Assert) =====
      // Verificar que se buscó si el email existe
      expect(User.findOne).toHaveBeenCalledWith({ 
        email: nuevoUsuario.email 
      });
      
      // Verificar que se hasheó la contraseña
      expect(bcrypt.hash).toHaveBeenCalledWith(
        nuevoUsuario.password,
        10
      );
      
      // Verificar que se guardó el usuario
      expect(mockSave).toHaveBeenCalled();
      
      // Verificar que se retornó la información correcta
      expect(resultado).toEqual({
        displayName: nuevoUsuario.displayName,
        email: nuevoUsuario.email
      });
    });

    it('debería rechazar registro si el email ya existe', async () => {
      // ===== PREPARAR =====
      const usuarioExistente = {
        displayName: 'Usuario Existente',
        email: 'existente@example.com',
        password: 'password123'
      };

      // Simular que SÍ existe un usuario con ese email
      jest.spyOn(User, 'findOne').mockResolvedValue({
        _id: 'existing123',
        email: usuarioExistente.email,
        displayName: 'Usuario Previo'
      });

      // ===== ACTUAR & AFIRMAR =====
      // La función debe lanzar un error
      await expect(register(usuarioExistente))
        .rejects
        .toThrow('El email ya está registrado');

      // Verificar que se buscó el usuario
      expect(User.findOne).toHaveBeenCalledWith({ 
        email: usuarioExistente.email 
      });
      
      // Verificar que NO se intentó hashear la contraseña
      // (porque falló antes)
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });

  /* ==========================================
     PRUEBAS DE LOGIN
     ========================================== */

  describe('Inicio de Sesión', () => {

    it('debería permitir login con credenciales correctas', async () => {
      // ===== PREPARAR =====  
      const credenciales = {
        email: 'usuario@example.com',
        password: 'password123'
      };

      // Simular que el usuario existe
      const usuarioMock = {
        _id: 'user123',
        displayName: 'Juan Pérez',
        email: credenciales.email,
        password: 'contraseña_hasheada',
        role: 'customer'
      };

      jest.spyOn(User, 'findOne').mockResolvedValue(usuarioMock);
      
      // Simular que la contraseña es correcta
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      
      // Simular generación de token
      jest.spyOn(jwt, 'sign').mockReturnValue('token_jwt_falso');

      // ===== ACTUAR =====
      const resultado = await login(credenciales);

      // ===== AFIRMAR =====
      // Verificar que se buscó el usuario
      expect(User.findOne).toHaveBeenCalledWith({ 
        email: credenciales.email 
      });
      
      // Verificar que se comparó la contraseña
      expect(bcrypt.compare).toHaveBeenCalledWith(
        credenciales.password,
        usuarioMock.password
      );
      
      // Verificar que se generó un token
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: usuarioMock._id, role: usuarioMock.role },
        expect.any(String), // JWT_SECRET
        { expiresIn: '1h' }
      );
      
      // Verificar que se retornó el token
      expect(resultado).toEqual({ token: 'token_jwt_falso' });
    });

    it('debería rechazar login si el usuario no existe', async () => {
      // ===== PREPARAR =====
      const credenciales = {
        email: 'noexiste@example.com',
        password: 'password123'
      };

      // Simular que NO se encuentra el usuario
      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      // ===== ACTUAR & AFIRMAR =====
      await expect(login(credenciales))
        .rejects
        .toThrow('Usuario no encontrado');

      // Verificar que se buscó el usuario
      expect(User.findOne).toHaveBeenCalledWith({ 
        email: credenciales.email 
      });
      
      // Verificar que NO se intentó comparar contraseñas
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('debería rechazar login si la contraseña es incorrecta', async () => {
      // ===== PREPARAR =====
      const credenciales = {
        email: 'usuario@example.com',
        password: 'passwordIncorrecto'
      };

      const usuarioMock = {
        _id: 'user123',
        email: credenciales.email,
        password: 'contraseña_hasheada'
      };

      // Usuario existe
      jest.spyOn(User, 'findOne').mockResolvedValue(usuarioMock);
      
      // Pero la contraseña es incorrecta
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      // ===== ACTUAR & AFIRMAR =====
      await expect(login(credenciales))
        .rejects
        .toThrow('Contraseña incorrecta');

      // Verificar que se comparó la contraseña
      expect(bcrypt.compare).toHaveBeenCalledWith(
        credenciales.password,
        usuarioMock.password
      );
      
      // Verificar que NO se generó token
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });
});
```

---

## Ejecutando las Pruebas

### Comandos Básicos

```bash
# Ejecutar todas las pruebas una vez
npm test

# Modo watch - re-ejecuta cuando guardas cambios
npm run test:watch

# Ver reporte de cobertura
npm run test:coverage

# Ejecutar solo un archivo específico
npm test authController.test.js

# Ejecutar pruebas que coincidan con un patrón
npm test -- --testNamePattern="registro"
```

### Interpretando los Resultados

Cuando ejecutas las pruebas, Jest te muestra algo así:

```
PASS  src/auth/__tests__/authController.test.js
  Sistema de Autenticación
    Registro de Usuarios
      ✓ debería registrar un nuevo usuario exitosamente (15ms)
      ✓ debería rechazar registro si el email ya existe (8ms)
    Inicio de Sesión
      ✓ debería permitir login con credenciales correctas (12ms)
      ✓ debería rechazar login con contraseña incorrecta (7ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        2.145s
```

**Si una prueba falla**:

```
FAIL  src/auth/__tests__/authController.test.js
  Sistema de Autenticación
    Registro de Usuarios
      ✕ debería registrar un nuevo usuario exitosamente (20ms)

  ● Sistema de Autenticación › Registro de Usuarios › debería registrar un nuevo usuario exitosamente

    expect(received).toEqual(expected)

    Expected: {"displayName": "María García", "email": "maria@example.com"}
    Received: {"displayName": "María García"}

      54 |       // Verificar que se retornó la información correcta
      55 |       expect(resultado).toEqual({
    > 56 |         displayName: nuevoUsuario.displayName,
         |                      ^
      57 |         email: nuevoUsuario.email
      58 |       });
```

Jest te dice:
- Qué prueba falló
- Qué esperabas
- Qué recibiste realmente
- En qué línea está el problema

---

## Cobertura de Código

La cobertura te dice qué porcentaje de tu código está siendo probado:

```bash
npm run test:coverage
```

Resultado:

```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   85.71 |    66.67 |     100 |   85.71 |
 authController.js  |   85.71 |    66.67 |     100 |   85.71 |
--------------------|---------|----------|---------|---------|
```

**Qué significan los números**:
- **Stmts (Statements)**: % de líneas de código ejecutadas
- **Branch**: % de condiciones if/else probadas
- **Funcs**: % de funciones probadas
- **Lines**: % de líneas de código probadas

**Meta razonable**: Apunta a 80%+ de cobertura, pero no te obsesiones con el 100%. Lo importante es probar los casos críticos.

---

## Mejores Prácticas

### 1. Nombres Descriptivos

```javascript
// ✅ Bueno
it('debería rechazar usuarios menores de 18 años', () => {});

// ❌ Malo
it('test de edad', () => {});
```

### 2. Una Afirmación por Prueba (Cuando sea Posible)

```javascript
// ✅ Bueno - una cosa a la vez
it('debería calcular el precio con descuento correctamente', () => {
  expect(calcularPrecioConDescuento(100, 10)).toBe(90);
});

it('debería mantener el precio si el descuento es 0', () => {
  expect(calcularPrecioConDescuento(100, 0)).toBe(100);
});

// ❌ Evitar - múltiples conceptos en una prueba
it('debería manejar descuentos', () => {
  expect(calcularPrecioConDescuento(100, 10)).toBe(90);
  expect(calcularPrecioConDescuento(100, 0)).toBe(100);
  expect(calcularPrecioConDescuento(100, 50)).toBe(50);
});
```

### 3. Usa beforeEach para Evitar Repetición

```javascript
// ✅ Bueno
describe('Carrito', () => {
  let carrito;

  beforeEach(() => {
    carrito = new Carrito();
  });

  it('debería estar vacío inicialmente', () => {
    expect(carrito.items).toEqual([]);
  });

  it('debería agregar productos', () => {
    carrito.agregarProducto({ id: 1 });
    expect(carrito.items.length).toBe(1);
  });
});
```

### 4. Prueba Casos Límite

```javascript
describe('Validador de Edad', () => {
  it('debería aceptar exactamente 18 años', () => {
    expect(esMayorDeEdad(18)).toBe(true);
  });

  it('debería rechazar 17 años', () => {
    expect(esMayorDeEdad(17)).toBe(false);
  });

  it('debería manejar edades negativas', () => {
    expect(esMayorDeEdad(-1)).toBe(false);
  });

  it('debería manejar edades muy altas', () => {
    expect(esMayorDeEdad(150)).toBe(true);
  });
});
```

### 5. No Pruebes Detalles de Implementación

```javascript
// ✅ Bueno - prueba el comportamiento
it('debería agregar producto al carrito', () => {
  carrito.agregarProducto(producto);
  expect(carrito.getTotal()).toBe(100);
});

// ❌ Malo - prueba cómo se implementa internamente
it('debería llamar al método _calcularTotal internamente', () => {
  const spy = jest.spyOn(carrito, '_calcularTotal');
  carrito.agregarProducto(producto);
  expect(spy).toHaveBeenCalled();
});
```

---

## Errores Comunes y Cómo Evitarlos

### 1. Olvidar return o await en Pruebas Asíncronas

```javascript
// ❌ Malo - la prueba termina antes de que se complete
it('debería obtener datos', () => {
  obtenerDatos().then(datos => {
    expect(datos).toBeDefined();
  });
});

// ✅ Bueno
it('debería obtener datos', async () => {
  const datos = await obtenerDatos();
  expect(datos).toBeDefined();
});
```

### 2. No Limpiar Mocks

```javascript
// ❌ Malo - los mocks de una prueba afectan a otras
describe('Pruebas', () => {
  it('primera prueba', () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
  });

  it('segunda prueba', () => {
    // User.findOne sigue mockeado de la prueba anterior
  });
});

// ✅ Bueno
describe('Pruebas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('primera prueba', () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
  });

  it('segunda prueba', () => {
    // Mocks limpios
  });
});
```

### 3. Pruebas que Dependen del Orden

```javascript
// ❌ Malo - la segunda prueba depende de la primera
describe('Contador', () => {
  let contador = 0;

  it('debería incrementar', () => {
    contador++;
    expect(contador).toBe(1);
  });

  it('debería incrementar de nuevo', () => {
    contador++; // depende del estado de la prueba anterior
    expect(contador).toBe(2);
  });
});

// ✅ Bueno - cada prueba es independiente
describe('Contador', () => {
  let contador;

  beforeEach(() => {
    contador = 0;
  });

  it('debería incrementar', () => {
    contador++;
    expect(contador).toBe(1);
  });

  it('debería incrementar de nuevo', () => {
    contador++;
    expect(contador).toBe(1); // empieza desde 0 cada vez
  });
});
```

---

## Estructura de Carpetas Recomendada

```
mi-proyecto/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── __tests__/
│   │       └── authController.test.js
│   ├── services/
│   │   ├── emailService.js
│   │   └── __tests__/
│   │       └── emailService.test.js
│   └── models/
│       ├── user.js
│       └── __tests__/
│           └── user.test.js
├── jest.config.js
└── package.json
```

---

## Resumen

✅ **Las pruebas unitarias** verifican que cada pieza de tu código funciona correctamente de forma aislada.

✅ **Jest** es una herramienta todo-en-uno para escribir y ejecutar pruebas en JavaScript.

✅ **Las pruebas siguen el patrón AAA**: Arrange (preparar), Act (actuar), Assert (afirmar).

✅ **Usa `describe`** para agrupar pruebas relacionadas e `it` para definir pruebas individuales.

✅ **Los mocks** simulan dependencias complejas para que puedas probar tu código de forma aislada.

✅ **`beforeEach` y `afterEach`** te ayudan a preparar y limpiar el estado entre pruebas.

✅ **Una buena cobertura de código (80%+)** te da confianza de que tu código funciona.

✅ **Las pruebas son documentación viva** que explica cómo debe comportarse tu código.

---

Esta guía te proporciona los fundamentos para comenzar a escribir pruebas unitarias efectivas con Jest en tus proyectos de Node.js. Recuerda: **las pruebas son una inversión que te ahorra tiempo y dolores de cabeza a largo plazo**.
