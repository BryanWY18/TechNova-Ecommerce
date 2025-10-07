# Guía de RxJS y Observables en Angular 19

**Documentación oficial de RxJS**: https://rxjs.dev/

## ¿Qué son los Observables?

Los observables son flujos de datos que pueden emitir valores a lo largo del tiempo. Son la base para manejar operaciones asíncronas en Angular, como peticiones HTTP, eventos del usuario, y comunicación entre componentes.

Un observable es como una manguera de agua: no hace nada hasta que abres el grifo (te suscribes). Una vez abierto, pueden fluir múltiples valores a través del tiempo.

## La Librería RxJS

RxJS (Reactive Extensions for JavaScript) es la librería que Angular usa para trabajar con observables. Proporciona herramientas para crear, transformar, combinar y controlar flujos de datos.

## Creación de Observables

### 1. of - Emitir Valores Literales

Crea un observable que emite valores secuencialmente y luego completa.

```typescript
import { of } from 'rxjs';

// Emite tres valores y completa
const numbers$ = of(1, 2, 3);

numbers$.subscribe({
  next: (value) => console.log('Valor:', value),
  complete: () => console.log('Completado')
});

// Output:
// Valor: 1
// Valor: 2
// Valor: 3
// Completado
```

**Caso de uso en Angular**:

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  // Retornar datos estáticos para testing
  getMockUser(): Observable<User> {
    return of({
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com'
    });
  }
}
```

### 2. from - Convertir Arrays, Promesas o Iterables

Convierte colecciones, promesas o cualquier iterable en un observable.

```typescript
import { from } from 'rxjs';

// Desde un array
const fromArray$ = from([10, 20, 30]);
fromArray$.subscribe(value => console.log(value));
// Output: 10, 20, 30

// Desde una promesa
const fromPromise$ = from(fetch('https://api.example.com/data'));
fromPromise$.subscribe(response => console.log(response));

// Desde un string (itera cada carácter)
const fromString$ = from('ABC');
fromString$.subscribe(char => console.log(char));
// Output: A, B, C
```

**Caso de uso en Angular**:

```typescript
@Component({
  selector: 'app-product-list',
  template: `
    <div *ngFor="let product of products$ | async">
      {{ product.name }}
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products$!: Observable<Product[]>;

  ngOnInit() {
    // Convertir array local a observable
    const localProducts = [
      { id: '1', name: 'Laptop' },
      { id: '2', name: 'Mouse' }
    ];
    this.products$ = from([localProducts]);
  }
}
```

### 3. fromEvent - Eventos del DOM

Crea un observable desde eventos del navegador.

```typescript
import { fromEvent } from 'rxjs';

// Escuchar clicks en el documento
const clicks$ = fromEvent(document, 'click');
clicks$.subscribe(event => {
  console.log('Click en coordenadas:', event.clientX, event.clientY);
});

// Escuchar cambios en un input
const input = document.querySelector('#search');
const keyups$ = fromEvent(input, 'keyup');
keyups$.subscribe(event => {
  console.log('Valor actual:', event.target.value);
});
```

**Caso de uso en Angular**:

```typescript
@Component({
  selector: 'app-scroll-tracker',
  template: '<div>Scroll detectado: {{ scrollCount }}</div>'
})
export class ScrollTrackerComponent implements OnInit, OnDestroy {
  scrollCount = 0;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    fromEvent(window, 'scroll')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.scrollCount++;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 4. interval y timer

Emiten valores en intervalos de tiempo.

```typescript
import { interval, timer } from 'rxjs';

// Emite cada segundo: 0, 1, 2, 3...
const counter$ = interval(1000);
counter$.subscribe(value => console.log('Contador:', value));

// Espera 2 segundos y luego emite cada segundo
const delayed$ = timer(2000, 1000);
delayed$.subscribe(value => console.log('Timer:', value));
```

**Caso de uso en Angular**:

```typescript
@Component({
  selector: 'app-countdown',
  template: `
    <div class="text-2xl font-bold">
      Tiempo restante: {{ timeLeft }}s
    </div>
  `
})
export class CountdownComponent implements OnInit, OnDestroy {
  timeLeft = 60;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    interval(1000)
      .pipe(
        takeUntil(this.destroy$),
        take(60)
      )
      .subscribe(() => {
        this.timeLeft--;
        if (this.timeLeft === 0) {
          console.log('¡Tiempo agotado!');
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Suscripción a Observables

Un observable no hace nada hasta que alguien se suscribe a él.

### Ejemplo Básico

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('https://api.example.com/products');
  }
}

@Component({...})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    // Suscribirse al observable
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        console.log('Productos cargados:', products);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      },
      complete: () => {
        console.log('Petición completada');
      }
    });
  }
}
```

## Operadores de RxJS

Los operadores son funciones que permiten transformar, filtrar y manipular los valores emitidos por los observables.

### Operadores de Transformación

#### 1. map - Transformar Valores

```typescript
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

const numbers$ = of(1, 2, 3, 4, 5);

numbers$.pipe(
  map(n => n * 2)
).subscribe(value => console.log(value));
// Output: 2, 4, 6, 8, 10
```

**Caso de uso en Angular**:

```typescript
@Component({...})
export class ProductComponent implements OnInit {
  productNames$!: Observable<string[]>;

  ngOnInit() {
    this.productNames$ = this.productService.getProducts().pipe(
      map(products => products.map(p => p.name.toUpperCase()))
    );
  }
}
```

#### 2. pluck - Extraer Propiedades

```typescript
import { of } from 'rxjs';
import { pluck } from 'rxjs/operators';

const users$ = of(
  { name: 'Juan', age: 25 },
  { name: 'María', age: 30 }
);

users$.pipe(
  pluck('name')
).subscribe(name => console.log(name));
// Output: Juan, María
```

### Operadores de Filtrado

#### 1. filter - Filtrar Valores

```typescript
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';

const numbers$ = of(1, 2, 3, 4, 5, 6);

numbers$.pipe(
  filter(n => n % 2 === 0)
).subscribe(value => console.log(value));
// Output: 2, 4, 6
```

**Caso de uso en Angular**:

```typescript
@Component({...})
export class ProductFilterComponent {
  products$!: Observable<Product[]>;
  inStockProducts$!: Observable<Product[]>;

  ngOnInit() {
    this.products$ = this.productService.getProducts();
    
    this.inStockProducts$ = this.products$.pipe(
      map(products => products.filter(p => p.stock > 0))
    );
  }
}
```

#### 2. distinctUntilChanged - Evitar Valores Duplicados Consecutivos

```typescript
import { of } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

const values$ = of(1, 1, 2, 2, 3, 3, 3, 4);

values$.pipe(
  distinctUntilChanged()
).subscribe(value => console.log(value));
// Output: 1, 2, 3, 4
```

#### 3. take - Tomar N Valores

```typescript
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

interval(1000).pipe(
  take(3)
).subscribe(value => console.log(value));
// Output: 0, 1, 2 (luego se completa)
```

#### 4. first y last

```typescript
import { of } from 'rxjs';
import { first, last } from 'rxjs/operators';

const numbers$ = of(1, 2, 3, 4, 5);

numbers$.pipe(first()).subscribe(v => console.log('Primero:', v));
// Output: Primero: 1

numbers$.pipe(last()).subscribe(v => console.log('Último:', v));
// Output: Último: 5
```

### Operadores de Utilidad

#### 1. tap - Efectos Secundarios

```typescript
import { of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

of(1, 2, 3).pipe(
  tap(value => console.log('Antes:', value)),
  map(value => value * 2),
  tap(value => console.log('Después:', value))
).subscribe();

// Output:
// Antes: 1
// Después: 2
// Antes: 2
// Después: 4
// Antes: 3
// Después: 6
```

**Caso de uso en Angular**:

```typescript
@Component({...})
export class ProductComponent {
  loadProducts() {
    this.productService.getProducts().pipe(
      tap(() => this.showLoadingSpinner()),
      tap(products => console.log('Productos recibidos:', products.length)),
      tap(() => this.hideLoadingSpinner())
    ).subscribe(products => {
      this.products = products;
    });
  }
}
```

#### 2. delay - Retrasar Emisiones

```typescript
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

of('Hola').pipe(
  delay(2000)
).subscribe(value => console.log(value));
// Se imprime "Hola" después de 2 segundos
```

#### 3. debounceTime - Esperar entre Emisiones

```typescript
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

const searchInput = document.querySelector('#search');
const search$ = fromEvent(searchInput, 'input');

search$.pipe(
  debounceTime(300),
  map(event => event.target.value)
).subscribe(searchTerm => {
  console.log('Buscar:', searchTerm);
});
```

**Caso de uso en Angular**:

```typescript
@Component({
  selector: 'app-search',
  template: `
    <input 
      type="text" 
      (input)="onSearch($event)"
      placeholder="Buscar productos..."
      class="w-full p-2 border rounded"
    >
    
    <div *ngFor="let result of searchResults$ | async">
      {{ result.name }}
    </div>
  `
})
export class SearchComponent implements OnInit {
  private searchTerms = new Subject<string>();
  searchResults$!: Observable<Product[]>;

  ngOnInit() {
    this.searchResults$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => this.productService.search(term))
    );
  }

  onSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerms.next(term);
  }
}
```

### Operadores de Combinación

#### 1. mergeMap (flatMap) - Aplanar Observables Anidados

```typescript
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

const users$ = of(1, 2, 3);

users$.pipe(
  mergeMap(id => this.http.get(`/api/users/${id}`))
).subscribe(user => console.log(user));
```

#### 2. switchMap - Cancelar Observables Anteriores

```typescript
import { fromEvent } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const clicks$ = fromEvent(button, 'click');

clicks$.pipe(
  switchMap(() => this.http.get('/api/data'))
).subscribe(data => console.log(data));
// Si haces click múltiples veces, solo la última petición se procesa
```

**Caso de uso en Angular**:

```typescript
@Component({...})
export class UserDetailComponent implements OnInit {
  user$!: Observable<User>;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user$ = this.route.params.pipe(
      switchMap(params => this.userService.getUser(params['id']))
    );
  }
}
```

#### 3. combineLatest - Combinar Múltiples Observables

```typescript
import { combineLatest } from 'rxjs';

const users$ = this.userService.getUsers();
const products$ = this.productService.getProducts();

combineLatest([users$, products$]).subscribe(([users, products]) => {
  console.log('Usuarios:', users);
  console.log('Productos:', products);
});
```

**Caso de uso en Angular**:

```typescript
@Component({...})
export class DashboardComponent implements OnInit {
  dashboardData$!: Observable<DashboardData>;

  ngOnInit() {
    this.dashboardData$ = combineLatest({
      users: this.userService.getUsers(),
      products: this.productService.getProducts(),
      sales: this.salesService.getSales()
    }).pipe(
      map(({ users, products, sales }) => ({
        totalUsers: users.length,
        totalProducts: products.length,
        totalSales: sales.reduce((sum, sale) => sum + sale.amount, 0)
      }))
    );
  }
}
```

## Desuscripción de Observables

Es crucial desuscribirse de los observables para evitar fugas de memoria.

### 1. Método Manual con unsubscribe

```typescript
@Component({...})
export class ProductComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  products: Product[] = [];

  ngOnInit() {
    this.subscription = this.productService.getProducts()
      .subscribe(products => {
        this.products = products;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
```

### 2. Múltiples Suscripciones

```typescript
@Component({...})
export class DashboardComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  ngOnInit() {
    this.subscriptions.add(
      this.userService.getUsers().subscribe(users => {
        this.users = users;
      })
    );

    this.subscriptions.add(
      this.productService.getProducts().subscribe(products => {
        this.products = products;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
```

### 3. takeUntil Pattern (Recomendado)

```typescript
@Component({...})
export class ProductComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  products: Product[] = [];

  ngOnInit() {
    this.productService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => {
        this.products = products;
      });

    this.categoryService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => {
        this.categories = categories;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 4. Async Pipe (Más Recomendado)

Angular gestiona automáticamente la suscripción y desuscripción.

```typescript
@Component({
  selector: 'app-product-list',
  template: `
    <div *ngFor="let product of products$ | async" 
         class="bg-white p-4 rounded shadow">
      <h3 class="font-bold">{{ product.name }}</h3>
      <p class="text-gray-600">\${{ product.price }}</p>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products$!: Observable<Product[]>;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.products$ = this.productService.getProducts();
  }
}
```

### 5. takeUntilDestroyed (Angular 16+)

```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({...})
export class ModernComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.productService.getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(products => {
        this.products = products;
      });
  }
}
```

## Manejo de Errores

### catchError - Capturar y Manejar Errores

```typescript
import { catchError, of } from 'rxjs';

@Component({...})
export class ProductComponent {
  loadProducts() {
    this.productService.getProducts().pipe(
      catchError(error => {
        console.error('Error al cargar productos:', error);
        // Retornar un valor por defecto
        return of([]);
      })
    ).subscribe(products => {
      this.products = products;
    });
  }
}
```

### retry - Reintentar en Caso de Error

```typescript
import { retry, catchError } from 'rxjs/operators';

this.http.get('/api/products').pipe(
  retry(3), // Reintentar 3 veces
  catchError(error => {
    console.error('Error después de 3 intentos:', error);
    return of([]);
  })
).subscribe(products => {
  this.products = products;
});
```

## Subjects

Los Subjects son observables especiales que pueden emitir valores manualmente.

### 1. Subject - Multicast Simple

```typescript
import { Subject } from 'rxjs';

const subject = new Subject<string>();

// Primer suscriptor
subject.subscribe(value => console.log('Suscriptor 1:', value));

// Segundo suscriptor
subject.subscribe(value => console.log('Suscriptor 2:', value));

// Emitir valores
subject.next('Hola');
subject.next('Mundo');

// Output:
// Suscriptor 1: Hola
// Suscriptor 2: Hola
// Suscriptor 1: Mundo
// Suscriptor 2: Mundo
```

**Caso de uso en Angular**:

```typescript
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationSubject = new Subject<string>();
  notification$ = this.notificationSubject.asObservable();

  showNotification(message: string) {
    this.notificationSubject.next(message);
  }
}

@Component({...})
export class AppComponent implements OnInit {
  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.notification$
      .subscribe(message => {
        alert(message);
      });
  }
}
```

### 2. BehaviorSubject - Con Valor Inicial

```typescript
import { BehaviorSubject } from 'rxjs';

const counter = new BehaviorSubject(0);

counter.subscribe(value => console.log('Valor actual:', value));
// Output inmediato: Valor actual: 0

counter.next(1);
counter.next(2);
```

**Caso de uso en Angular**:

```typescript
@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  addItem(item: CartItem) {
    const currentItems = this.cartItemsSubject.value;
    this.cartItemsSubject.next([...currentItems, item]);
  }

  getCartCount(): number {
    return this.cartItemsSubject.value.length;
  }
}
```

### 3. ReplaySubject - Recordar Valores Anteriores

```typescript
import { ReplaySubject } from 'rxjs';

const subject = new ReplaySubject(2); // Recordar últimos 2 valores

subject.next(1);
subject.next(2);
subject.next(3);

subject.subscribe(value => console.log('Nuevo suscriptor:', value));
// Output:
// Nuevo suscriptor: 2
// Nuevo suscriptor: 3
```

## Ejemplo Completo: Búsqueda de Productos con RxJS

```typescript
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { 
  debounceTime, 
  distinctUntilChanged, 
  switchMap, 
  tap, 
  catchError,
  filter 
} from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-product-search',
  template: `
    <div class="max-w-2xl mx-auto p-6">
      <input 
        [formControl]="searchControl"
        type="text"
        placeholder="Buscar productos..."
        class="w-full p-3 border rounded-lg shadow-sm"
      >

      @if (loading) {
        <div class="mt-4 text-center">
          <p class="text-gray-500">Buscando productos...</p>
        </div>
      }

      <div class="mt-6 grid gap-4">
        @for (product of searchResults$ | async; track product.id) {
          <div class="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg">{{ product.name }}</h3>
            <p class="text-gray-600 mt-2">{{ product.description }}</p>
            <p class="text-blue-600 font-bold mt-2">\${{ product.price }}</p>
          </div>
        } @empty {
          @if (searchControl.value && !loading) {
            <div class="text-center text-gray-500 py-8">
              No se encontraron productos
            </div>
          }
        }
      </div>
    </div>
  `
})
export class ProductSearchComponent implements OnInit {
  searchControl = new FormControl('');
  searchResults$!: Observable<Product[]>;
  loading = false;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.searchResults$ = this.searchControl.valueChanges.pipe(
      // Esperar 300ms después de que el usuario deje de escribir
      debounceTime(300),
      
      // Solo buscar si el valor cambió
      distinctUntilChanged(),
      
      // Solo buscar si hay al menos 2 caracteres
      filter(searchTerm => searchTerm ? searchTerm.length >= 2 : false),
      
      // Mostrar indicador de carga
      tap(() => this.loading = true),
      
      // Cancelar búsquedas anteriores y hacer nueva búsqueda
      switchMap(searchTerm => 
        this.productService.searchProducts(searchTerm).pipe(
          // Manejar errores
          catchError(error => {
            console.error('Error en búsqueda:', error);
            return of([]);
          })
        )
      ),
      
      // Ocultar indicador de carga
      tap(() => this.loading = false)
    );
  }
}
```

## Mejores Prácticas

### 1. Usar Async Pipe Siempre que Sea Posible

```typescript
// Buena práctica
@Component({
  template: `
    <div *ngFor="let item of items$ | async">{{ item }}</div>
  `
})
export class GoodComponent {
  items$ = this.service.getItems();
}

// Evitar
@Component({
  template: `
    <div *ngFor="let item of items">{{ item }}</div>
  `
})
export class BadComponent implements OnInit, OnDestroy {
  items: any[] = [];
  private subscription!: Subscription;

  ngOnInit() {
    this.subscription = this.service.getItems()
      .subscribe(items => this.items = items);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
```

### 2. Nombrar Observables con el Sufijo $

```typescript
// Buena práctica - fácil identificar observables
products$: Observable<Product[]>;
user$: Observable<User>;
loading$: Observable<boolean>;

// Evitar
products: Observable<Product[]>;
user: Observable<User>;
```

### 3. Evitar Suscripciones Anidadas

```typescript
// Mal - suscripciones anidadas (callback hell)
this.service1.getData().subscribe(data1 => {
  this.service2.getData(data1).subscribe(data2 => {
    this.service3.getData(data2).subscribe(data3 => {
      console.log(data3);
    });
  });
});

// Bien - usar operadores de combinación
this.service1.getData().pipe(
  switchMap(data1 => this.service2.getData(data1)),
  switchMap(data2 => this.service3.getData(data2))
).subscribe(data3 => {
  console.log(data3);
});
```

### 4. Manejar Errores Apropiadamente

```typescript
this.productService.getProducts().pipe(
  retry(2),
  catchError(error => {
    this.errorMessage = 'Error al cargar productos';
    console.error(error);
    return of([]);
  })
).subscribe(products => {
  this.products = products;
});
```

## Resumen

Un observable es un flujo de datos que puede emitir valores a lo largo del tiempo.

RxJS provee operadores para crear (`of`, `from`, `fromEvent`) y manipular (`map`, `filter`, `switchMap`) observables.

Para usar los valores debes suscribirte, pero siempre debes desuscribirte para evitar fugas de memoria.

Las mejores formas de gestionar suscripciones en Angular son: `async pipe` y `takeUntilDestroyed`.

Los operadores más comunes son: `map`, `filter`, `tap`, `switchMap`, `debounceTime`, `catchError`.

Los Subjects (`Subject`, `BehaviorSubject`, `ReplaySubject`) permiten emitir valores manualmente.

Esta guía proporciona las bases para trabajar eficientemente con RxJS y observables en Angular 19.