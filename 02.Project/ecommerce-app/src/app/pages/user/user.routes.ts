import { Routes } from "@angular/router";

export const USER_ROUTES: Routes =[
    {
        path: 'paymethods',
        loadComponent:()=>import('./paymethods/paymethods.component').then(c=>c.PaymethodsComponent),
        title: 'Métodos de pago'
    },
    {
        path: 'shipping-address',
        loadComponent:()=>import('./shipping-address/shipping-address.component').then(c=>c.ShippingAddressComponent),
        title: 'Direcciones de envío'
    },
    {
        path: 'cart',
        loadComponent:()=>import('./cart/cart.component').then(c=>c.CartComponent),
        title: 'Carrito'
    },
    {
        path: 'profile',
        loadComponent:()=>import('./profile/profile.component').then(c=>c.ProfileComponent),
        title: 'Mi Perfil'
    },
    {
        path: 'whish-list',
        loadComponent:()=>import('./wish-list/wish-list.component').then(c=>c.WishListComponent),
        title: 'Lista de deseos'
    },
    {
        path:'',
        redirectTo:'profile',
        pathMatch:'full',
    }
]