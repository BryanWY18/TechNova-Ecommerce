import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';
import { ShippingAddressService } from '../../../core/services/shipping-address/shipping-address.service';
import { PaymentMethodsService } from '../../../core/services/paymentMethods/payment-methods.service';
import { Observable, combineLatest, map } from 'rxjs';
import { Cart } from '../../../core/types/Cart';
import { PaymentMethod } from '../../../core/types/PaymentMethod';
import { ShippingAddress } from '../../../core/types/ShippingAddress';
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

  sendOrder(){
    Swal.fire({
      title: '¡Orden Enviada!',
      text: 'Gracias por su compra. El recibo fue enviado a su correo.',
      icon: 'success',
      confirmButtonText: 'Continúa explorando'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.cartService.clearCart().subscribe({
          next: () => {
            this.router.navigate(['/products']);
          },
          error: (err) => {
            console.error('Error al limpiar carrito:', err);
            this.router.navigate(['/products']);
          }
        });
      }
    });
  }
}