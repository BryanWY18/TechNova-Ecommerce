import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';
import { ShippingAddressService } from '../../../core/services/shipping-address/shipping-address.service';
import { PaymentMethodsService } from '../../../core/services/paymentMethods/payment-methods.service';
import { OrderService } from '../../../core/services/order/order.service';
import { Observable, catchError, combineLatest, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { Cart } from '../../../core/types/Cart';
import { PaymentMethod } from '../../../core/types/PaymentMethod';
import { ShippingAddress } from '../../../core/types/ShippingAddress';
import { CreateOrder, Order } from '../../../core/types/Order';
import Swal from 'sweetalert2';

interface CheckoutData {
  cart: Cart | null;
  shippingAddress: ShippingAddress | null;
  paymentMethod: PaymentMethod | null;
  cartTotal: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  checkoutData$!: Observable<CheckoutData>;
  
  constructor(
    private cartService: CartService, 
    private shippingAddressService: ShippingAddressService, 
    private paymentMethodsService: PaymentMethodsService,
    private orderService: OrderService,
    private router: Router
  ){}

  ngOnInit():void{
    this.loadCheckoutData();
  }

  loadCheckoutData(){
    const userId = this.cartService.getUserId();
    this.checkoutData$ = combineLatest({
      cart: this.cartService.getCartByUserId(userId),
      shippingAddress: this.shippingAddressService.getDefaultAddress(),
      paymentMethod: this.paymentMethodsService.getDefaultPaymentMethod(),
      cartTotal: this.cartService.getCartTotal()
    });
  }

  newOrder() {
    this.checkoutData$
      .pipe(
        take(1),
        switchMap((data) => {
          const userId = this.orderService.getUserId();
          if (!data.cart || !data.shippingAddress || !data.paymentMethod) {
          return throwError(() => new Error('Incomplete checkout data'));
        }
          const orderData: CreateOrder = {
            user: userId,
            products: data.cart.products.map(item => ({
              productId: item.product._id,
              quantity: item.quantity,
              price: item.product.price
            })),
            shippingAddress: data.shippingAddress._id,
            paymentMethod: data.paymentMethod._id,
            shippingCost: 0,
            totalPrice: data.cartTotal
          };
          return this.orderService.createOrder(orderData);
        }),
        tap((order) => {
          console.log('Orden creada exitosamente:', order);
        }),
        catchError((error) => {
          console.error('Error al crear orden:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  sendOrder(){
    Swal.fire({
      title: '¡Orden Enviada!',
      text: 'Gracias por su compra. El recibo fue enviado a su correo.',
      icon: 'success',
      confirmButtonText: 'Continúa explorando'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.newOrder();
        this.cartService.clearCart().subscribe({
          next: () => {
          },
          error: (err) => {
            console.error('Error al limpiar carrito:', err);
            this.router.navigate(['/']);
          }
        });
        this.router.navigate(['/user/order']);
      }
    });
  }
}