import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CartService } from '../../../core/services/cart/cart.service';
import { Cart } from '../../../core/types/Cart';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
 cart$: Observable<Cart | null> = of(null);
  constructor(private cartService:CartService){}

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$; 
  }

}
