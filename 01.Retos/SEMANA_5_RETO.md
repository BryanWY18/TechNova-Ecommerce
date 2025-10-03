# Tarea Semana 5 - Formulario de Dirección de Envío

## Historia de Usuario: Gestión de Direcciones de Envío

**Como** usuario del ecommerce  
**Quiero** poder agregar y editar mis direcciones de envío  
**Para** recibir mis pedidos en diferentes ubicaciones de manera conveniente

### Criterios de Aceptación
- [ ] Formulario reactivo con validación en tiempo real
- [ ] Todos los campos obligatorios deben estar validados
- [ ] El código postal debe tener formato válido (5 dígitos)
- [ ] La dirección debe tener mínimo 10 caracteres
- [ ] El formulario debe cargar datos existentes en modo edición
- [ ] Mostrar mensajes de error específicos y útiles
- [ ] Prevenir envío si hay errores de validación

### Casos de Prueba
- [ ] **Válidos:** 
  - Dirección: "Av. Insurgentes Sur 1234, Col. Centro"
  - Código postal: "12345" 
  - Ciudad: "Ciudad de México"
- [ ] **Inválidos:** 
  - Dirección muy corta: "Calle 1" 
  - Código postal: "abc", "1234567890"
  - Campos vacíos en campos requeridos

## Tareas Técnicas

### 1. Crear Tipo de Datos
Crear el archivo `src/app/core/types/ShippingAddress.ts`:


### 2. Validadores Personalizados
- [ ] `postalCodeValidator` - Validar formato de código postal (5 dígitos)
- [ ] `addressLengthValidator` - Mínimo 10 caracteres para dirección

### 3. Componente ShippingAddressForm
- [ ] Ubicación: `src/app/components/shippingAddress/shipping-address-form/`
- [ ] Formulario reactivo con FormBuilder
- [ ] Usar FormFieldComponent existente

## Validaciones Requeridas

### Campos Obligatorios
- **address**: mínimo 10 caracteres, requerido
- **city**: requerido
- **state**: requerido  
- **postalCode**: formato válido (5 dígitos), requerido
- **country**: requerido

### Mensajes de Error
- Campo requerido: "Este campo es requerido"
- Dirección muy corta: "La dirección debe tener al menos 10 caracteres"
- Código postal inválido: "El código postal debe tener 5 dígitos"

## Objetivos de Aprendizaje

- **Formularios reactivos** con validación personalizada
- **Validadores personalizados** reutilizables
- **Tipado fuerte** TypeScript
- **Componentes reutilizables** (FormFieldComponent)
- **UX de formularios** con feedback en tiempo real
- **Manejo de estados** de edición y creación

## Entregables

1. **Tipo ShippingAddress** definido con Types
2. **Componente ShippingAddressForm** completamente funcional
3. **Validadores personalizados** para código postal y dirección
4. **Integración con FormFieldComponent** existente
5. **Manejo de errores** específico para el usuario
6. **Modo edición** que carga datos existentes correctamente

## Plan de Pruebas

### Validación de Dirección
- [ ] Acepta direcciones con mínimo 10 caracteres
- [ ] Rechaza direcciones muy cortas
- [ ] Permite direcciones con números y caracteres especiales

### Validación de Código Postal
- [ ] Acepta formato: `12345`
- [ ] Rechaza formatos inválidos: `abc123`, `1234567890`
- [ ] Muestra mensaje de error apropiado

### Modo Edición
- [ ] Carga datos existentes correctamente
- [ ] Actualiza validaciones dinámicamente
- [ ] Emite evento con datos actualizadosd