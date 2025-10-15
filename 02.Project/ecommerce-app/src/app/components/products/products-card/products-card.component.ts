import { Component, Input } from '@angular/core';
import { Product } from '../../../core/types/Products';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminDirective } from '../../../core/directives/admin.directive';
import { OfferDirective } from '../../../core/directives/offer/offer.directive';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-products-card',
  standalone: true,
  imports: [RouterLink, CommonModule, AdminDirective, OfferDirective],
  templateUrl: './products-card.component.html',
  styleUrl: './products-card.component.css'
})
export class ProductsCardComponent {
  @Input() product!:Product;
  
  constructor(private cartService: CartService){}
  loading:boolean = false;


  addToCart(){
    this.loading = true
    console.log(this.loading);
    this.cartService.addToCart(this.product._id).subscribe({
      next:()=> this.loading = false,
      error:()=> this.loading = false,
    });
  }
}
