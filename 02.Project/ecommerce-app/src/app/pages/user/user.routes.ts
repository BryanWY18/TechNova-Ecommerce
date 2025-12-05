import { Routes } from "@angular/router";
import { userResolver } from "../../core/resolvers/user/user.resolver";

export const USER_ROUTES: Routes =[
    {
        path: 'paymethods',
        loadComponent: ()=> import('./paymethods/paymethods.component').then(c=>c.PaymethodsComponent),
        title: 'Metodos de pago'
    },
    {
        path: 'shipping_address',
        loadComponent: ()=> import('./shipping-address/shipping-address.component').then(c=>c.ShippingAddressComponent),
        title:'Direcciones de envio',
    },
    {
        path:'cart',
        loadComponent:()=> import('./cart/cart.component').then(c=>c.CartComponent),
        title:'Carrito' 
    },
    {
        path:'profile', 
        loadComponent: ()=>import('./profile/profile.component').then(c=>c.ProfileComponent),
        title: 'Mi perfil',
        resolve:{
            user: userResolver
        }
    },
    {
        path:'checkout',
        loadComponent:()=> import('./checkout/checkout.component').then(c=>c.CheckoutComponent),
        title:'Checkout'    
    },
    {
        path:'order',
        loadComponent:()=> import('./order/order.component').then(c=>c.OrderComponent),
        title:'Order'
    },
    {
        //user
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
    }
]