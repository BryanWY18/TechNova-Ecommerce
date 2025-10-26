# Reto Semana 3 - Sistema de Autenticación y Perfil de Usuario

## Historia de Usuario 1: Navegación Condicional de Autenticación

**Como** visitante no autenticado del ecommerce  
**Quiero** ver opciones de "Iniciar Sesión" y "Registrarse" en la navegación  
**Para** poder acceder a mi cuenta o crear una nueva

### Criterios de Aceptación
- [ ] En la navbar, mostrar botones "Iniciar Sesión" y "Registrarse" si no hay sesión activa
- [ ] Los botones deben estar visualmente bien posicionados y ser responsivos
- [ ] Al hacer clic, navegar a `/login` y `/register` respectivamente

## Historia de Usuario 2: Navegación de Usuario Autenticado

**Como** usuario autenticado del ecommerce  
**Quiero** ver mi información de perfil y opciones de cuenta en la navegación  
**Para** acceder rápidamente a mis datos, lista de deseos y carrito

### Criterios de Aceptación
- [ ] Mostrar dropdown/menú con nombre del usuario cuando esté autenticado
- [ ] Incluir opciones: "Mi Perfil", "Lista de Deseos", "Carrito", "Cerrar Sesión"
- [ ] Reemplazar botones de login/register por este menú de usuario


## Tareas Técnicas

### Directivas y Servicios
- [ ] Crear directiva `ng g d core/directives/auth/authenticated`
- [ ] Crear directiva `ng g d core/directives/auth/not-authenticated`

### Componentes
- [ ] Crear componente `user-profile`
- [ ] Crear componente `auth-nav` (menú de autenticación)
- [ ] Actualizar navbar para usar navegación condicional


##  Objetivos de Aprendizaje

- **Directivas estructurales personalizadas** en Angular
- **UX condicional** basada en estado del usuario
- **Componentes responsivos** con Tailwind CSS

##  Estructura de Archivos

```
src/app/
├── pages/
│   ├── auth/
│   │   ├── login/
│   │   ├── register/
│   │   └── profile/
│   └── user-profile/
├── components/
│   └── navigation/
│       ├── navbar/
│       └── auth-nav/
├── core/
│   ├── services/
│   │   └── auth/
│   └── directives/
│       └── auth/
│           ├── authenticated.directive.ts
│           └── not-authenticated.directive.ts
└── app.routes.ts
```

## Entregables

1. **Sistema de navegación condicional** que muestra contenido según estado de autenticación
2. **Directivas funcionales** `*appAuthenticated` y `*appNotAuthenticated`
3. **UI responsive** implementada con Tailwind CSS


## Mockups de Referencia

### Navbar sin autenticar:
```
[Logo] 
[Iniciar Sesión] 
[Registrarse]
[Productos] 
[Inicio]
```

### Navbar autenticado:
```
[Logo]       
[👤 Juan Pérez ▼]
├─ Mi Perfil
├─ Lista de Deseos  
├─ Mis Pedidos
└─ Cerrar Sesión
[Productos] 
[Inicio]
```

## Casos de Prueba

- [ ] Navegación muestra botones correctos según estado de auth
- [ ] Directivas muestran/ocultan contenido apropiadamente
- [ ] Perfil carga y muestra datos del usuario correctamente
- [ ] Logout limpia estado y redirige apropiadamente