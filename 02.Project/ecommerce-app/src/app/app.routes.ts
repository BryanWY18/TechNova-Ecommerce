import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home' },
  {
    path: 'products',
    loadComponent: () =>
      import('../app/pages/products/products.component').then(
        (c) => c.ProductsComponent
      ),
    title: 'products',
  },
  {
    path:'product-view/:id', 
    loadComponent: () => import('../app/pages/product-detail/product-detail.component').then(
      (c)=> c.ProductDetailComponent
    ),
    title:'product details'
  },
  {
    path: 'register', loadComponent:()=> import('../app/pages/register/register.component').then(c=>c.RegisterComponent),
    title: 'registro'
  }
  ,
  {
    path: 'login', loadComponent:()=> import('../app/pages/login/login.component').then(c=>c.LoginComponent),
    title: 'login'
  }
  ,
  {
    path: 'user/cart', loadComponent: () => import('../app/pages/cart/cart.component').then(c=>c.CartComponent),
    title: 'Carrito'
  },
  {
    path: 'products/:id', loadComponent: () => import('../app/pages/product-detail/product-detail.component').then(c => c.ProductDetailComponent),
    title: 'Detalle del producto'
  }
];
