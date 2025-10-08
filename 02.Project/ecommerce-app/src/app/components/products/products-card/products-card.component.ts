import { Component, Input } from '@angular/core';
import { Product } from '../../../core/types/Products';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminDirective } from '../../../core/directives/admin.directive';
import { OfferDirective } from '../../../core/directives/offer/offer.directive';
import { ToastService } from '../../../core/services/toast/toast.service';

@Component({
  selector: 'app-products-card',
  standalone: true,
  imports: [RouterLink, CommonModule, AdminDirective, OfferDirective],
  templateUrl: './products-card.component.html',
  styleUrl: './products-card.component.css'
})
export class ProductsCardComponent {
  @Input() product!:Product;
  constructor(private toastService: ToastService){}


  addToCart(){
    console.log('**')
    this.toastService.success(`${this.product.name} agregado a tu carrito`);
  }
}
