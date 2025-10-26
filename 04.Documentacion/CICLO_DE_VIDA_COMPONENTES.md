# Ciclo de Vida de Componentes en Angular 19

**Documentación oficial**: https://angular.dev/guide/components/lifecycle

## ¿Qué es el Ciclo de Vida?

El ciclo de vida de un componente son las etapas por las que pasa desde que nace hasta que se destruye. Angular nos permite "escuchar" estas etapas para ejecutar código en el momento adecuado.

Piénsalo como las etapas de la vida de una persona: nacer, crecer, envejecer y morir. Los componentes también tienen etapas similares.

## Etapas Principales

| Etapa | Método | ¿Cuándo ocurre? |
|-------|--------|-----------------|
| **Nacimiento** | `ngOnInit` | Cuando el componente está listo para usar |
| **Crecimiento** | `ngOnChanges` | Cuando algo cambia en el componente |
| **Madurez** | `ngAfterViewInit` | Cuando la vista está completamente cargada |
| **Muerte** | `ngOnDestroy` | Antes de que el componente desaparezca |

## Los Métodos Más Importantes

### 1. ngOnInit - "Cuando Nace"
Se ejecuta UNA vez cuando el componente está listo.

```typescript
@Component({
  template: `
    <div class="p-4 bg-blue-100 rounded">
      <h2>Bienvenido {{ userName }}</h2>
    </div>
  `
})
export class WelcomeComponent implements OnInit {
  userName = '';

  ngOnInit() {
    // Aquí cargamos datos iniciales
    this.userName = 'Juan';
    console.log('¡El componente está listo!');
  }
}
```

**Úsalo para**: Cargar datos, configurar el componente.

### 2. ngOnDestroy - "Cuando Muere"
Se ejecuta antes de que el componente desaparezca.

```typescript
@Component({
  template: `
    <div class="p-4 bg-red-100 rounded">
      <p>Tiempo transcurrido: {{ seconds }} segundos</p>
    </div>
  `
})
export class TimerComponent implements OnInit, OnDestroy {
  seconds = 0;
  private timer: any;

  ngOnInit() {
    // Iniciar un cronómetro
    this.timer = setInterval(() => {
      this.seconds++;
    }, 1000);
  }

  ngOnDestroy() {
    // ¡Importante! Limpiar el cronómetro
    if (this.timer) {
      clearInterval(this.timer);
      console.log('Cronómetro limpiado');
    }
  }
}
```

**Úsalo para**: Limpiar cronómetros, cancelar suscripciones, liberar memoria.

### 3. ngOnChanges - "Cuando Algo Cambia"
Se ejecuta cada vez que cambian los datos que llegan al componente.

```typescript
@Component({
  selector: 'app-user-card',
  template: `
    <div class="p-4 bg-green-100 rounded">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <small>Cambios detectados: {{ changeCount }}</small>
    </div>
  `
})
export class UserCardComponent implements OnChanges {
  @Input() user = { name: '', email: '' };
  changeCount = 0;

  ngOnChanges() {
    this.changeCount++;
    console.log('El usuario cambió:', this.user);
  }
}
```

**Úsalo para**: Reaccionar cuando cambian los datos que recibe el componente.

## Ejemplos Prácticos

### Componente de Lista de Productos
```typescript
@Component({
  selector: 'app-product-list',
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      @if (loading) {
        <div class="col-span-full text-center">
          <p>Cargando productos...</p>
        </div>
      } @else {
        @for (product of products; track product.id) {
          <div class="bg-white p-4 rounded shadow">
            <h3 class="font-bold">{{ product.name }}</h3>
            <p class="text-gray-600">${{ product.price }}</p>
          </div>
        }
      }
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  loading = true;

  ngOnInit() {
    console.log('Cargando productos...');
    
    // Simular carga de datos
    setTimeout(() => {
      this.products = [
        { id: 1, name: 'Laptop', price: 999 },
        { id: 2, name: 'Mouse', price: 25 },
        { id: 3, name: 'Teclado', price: 75 }
      ];
      this.loading = false;
      console.log('Productos cargados!');
    }, 2000);
  }
}
```

### Componente con Datos que Cambian
```typescript
@Component({
  selector: 'app-counter',
  template: `
    <div class="text-center p-6 bg-gray-100 rounded">
      <h2 class="text-2xl font-bold mb-4">Contador: {{ count }}</h2>
      <button (click)="increment()" 
              class="bg-blue-500 text-white px-4 py-2 rounded mr-2">
        Sumar
      </button>
      <button (click)="decrement()" 
              class="bg-red-500 text-white px-4 py-2 rounded">
        Restar
      </button>
    </div>
  `
})
export class CounterComponent implements OnInit, OnDestroy {
  @Input() initialValue = 0;
  count = 0;
  private autoIncrement: any;

  ngOnInit() {
    this.count = this.initialValue;
    console.log('Contador iniciado en:', this.count);

    // Auto incrementar cada 5 segundos
    this.autoIncrement = setInterval(() => {
      this.count++;
    }, 5000);
  }

  ngOnDestroy() {
    // Limpiar el auto incremento
    if (this.autoIncrement) {
      clearInterval(this.autoIncrement);
      console.log('Auto incremento detenido');
    }
  }

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }
}
```

### Componente con @defer
```typescript
@Component({
  selector: 'app-dashboard',
  template: `
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
      
      <!-- Contenido que siempre se ve -->
      <div class="bg-blue-100 p-4 rounded mb-6">
        <p>Esta sección siempre está visible</p>
      </div>

      <!-- Contenido que se carga después -->
      @defer (on viewport) {
        <app-heavy-chart />
      } @loading {
        <div class="bg-gray-100 p-8 rounded text-center">
          <p>Cargando gráfico...</p>
        </div>
      } @placeholder {
        <div class="bg-yellow-100 p-4 rounded text-center">
          <p>El gráfico se cargará cuando bajes</p>
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  ngOnInit() {
    console.log('Dashboard listo');
  }
}

@Component({
  selector: 'app-heavy-chart',
  template: `
    <div class="bg-green-100 p-6 rounded">
      <h3 class="text-xl font-bold mb-4">Gráfico Pesado</h3>
      <div class="h-64 bg-green-200 rounded flex items-center justify-center">
        <p>Aquí iría un gráfico complejo</p>
      </div>
    </div>
  `
})
export class HeavyChartComponent implements OnInit, OnDestroy {
  ngOnInit() {
    console.log('Gráfico pesado cargado');
  }

  ngOnDestroy() {
    console.log('Gráfico pesado destruido');
  }
}
```

## Consejos Importantes

###  Buenas Prácticas
```typescript
// Siempre limpia los recursos
ngOnDestroy() {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
  if (this.timer) {
    clearInterval(this.timer);
  }
}

// Usa ngOnInit para inicializar
ngOnInit() {
  this.loadData();
  this.setupEventListeners();
}
```

###  Evita Esto
```typescript
// No hagas cálculos pesados en ngOnChanges
ngOnChanges() {
  //  Malo - esto se ejecuta muy seguido
  for (let i = 0; i < 1000000; i++) {
    // cálculo pesado
  }
}

// No olvides limpiar
ngOnDestroy() {
  //  Malo - olvidar limpiar causa memory leaks
  // this.timer sigue corriendo!
}
```

## Cuándo Usar Cada Uno

| Situación | Método a Usar |
|-----------|---------------|
| Cargar datos al inicio | `ngOnInit` |
| Reaccionar a cambios | `ngOnChanges` |
| Limpiar recursos | `ngOnDestroy` |
| Trabajar con el DOM | `ngAfterViewInit` |

## Orden de Ejecución

Cuando un componente nace, Angular ejecuta los métodos en este orden:

1. `ngOnChanges` (si hay inputs)
2. `ngOnInit` 
3. `ngAfterViewInit`

Cuando algo cambia:
1. `ngOnChanges`

Cuando muere:
1. `ngOnDestroy`

Esta guía te da lo esencial para trabajar con el ciclo de vida de componentes en Angular 19 de manera simple y práctica.