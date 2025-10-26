# Reto Semana 2 - Búsqueda y Carousel de Productos

##  Historia de Usuario 1: Navegación desde Búsqueda

**Como** usuario del ecommerce  
**Quiero** hacer clic en un producto de los resultados de búsqueda  
**Para** ver sus detalles completos y tomar una decisión de compra

### Criterios de Aceptación
- [ ] Al hacer clic en un producto del search, navegar a `/products/:id`
- [ ] Integrar con el componente `product-view` existente
- [ ] Mantener el término de búsqueda en la URL como query parameter

##  Historia de Usuario 2: Carousel con Ofertas

**Como** dueño del ecommerce  
**Quiero** mostrar los 10 productos más baratos en el carousel de la home  
**Para** destacar ofertas y productos accesibles

### Criterios de Aceptación
- [ ] Obtener los 10 productos con menor precio del API
- [ ] Formatear datos para el carousel usando el servicio existente
- [ ] Mostrar loader mientras cargan las imágenes
- [ ] Usar placeholder cuando no hay imagen disponible

## Tareas Técnicas

### Búsqueda
- [ ] Implementar navegación en `search-product.component`
- [ ] Configurar routing con parámetros

### Carousel
- [ ] Modificar `ProductService.getProducts()` para ordenar por precio
- [ ] Crear pipe para formatear datos del API al formato del carousel
- [ ] Implementar estados de loading en las imágenes

## Objetivos de Aprendizaje
- Navegación programática con Angular Router
- Consumo de APIs con parámetros de ordenamiento
- Transformación de datos con pipes
- Manejo de estados de carga en componentes

##  Estructura de Archivos
```
src/app/
├── pages/
│   ├── home/
│   │   ├── home.component.ts
│   │   └── home.component.html
│   └── product-detail/
│       ├── product-detail.component.ts
│       └── product-detail.component.html
├── components/
│   ├── shared/carousel/
│   └── products/search-product/
├── core/
│   ├── services/product/
└── app.routes.ts
```

##  Entregables
1. Navegación funcional desde búsqueda a detalles
2. Carousel mostrando productos más baratos
3. Manejo de estados de loading y error
4. Tests unitarios de la nueva funcionalidad
