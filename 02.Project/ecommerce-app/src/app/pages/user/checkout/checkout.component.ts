import { Component } from '@angular/core';
import { CartService } from '../../../core/services/cart/cart.service';
import { ShippingAddressService } from '../../../core/services/shipping-address/shipping-address.service';
import { PaymentMethodsService } from '../../../core/services/paymentMethods/payment-methods.service';
import { Observable } from 'rxjs';
import { Cart } from '../../../core/types/Cart';
import { PaymentMethod } from '../../../core/types/PaymentMethod';
import { ShippingAddress } from '../../../core/types/ShippingAddress';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  cart$!: Observable<Cart | null>
  shippingAddress$!: Observable<ShippingAddress | null>
  paymentMethod$!: Observable<PaymentMethod | null>;

  constructor(
    private cartService: CartService, 
    private shippingAddressService: ShippingAddressService, 
    private paymentMethodsService: PaymentMethodsService
  ){}


  ngOnInit():void{
    this.loadComponents();
  }

  loadComponents(){

  }

  getUserCart(){
    const userId = this.cartService.getUserId();
    this.cart$ = this.cartService.getCartByUserId(userId);
  }

  getUserAddress(){
    this.shippingAddress$ = this.shippingAddressService.getDefaultAddress();
  }

  getUserPayment(){
  }

  sendOrder(){

  }

}
