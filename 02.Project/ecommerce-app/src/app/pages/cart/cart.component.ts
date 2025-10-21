import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { Observable, of } from 'rxjs';
import { Cart } from '../../core/types/Cart';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink, RouterModule],
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{

  cart$: Observable<Cart | null> = of(null);
  totalProducts$: Observable<number> = of(0);
  carritoEliminado = false;
  
  constructor(private cartService:CartService, public router:Router ){}

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$; 
    this.totalItem();
  }

  totalItem(){
    this.totalProducts$ = this.cartService.cartItemCount;
  }
  
  deleteCart(cartId: string): void {
  this.cartService.deleteCart(cartId).subscribe({
    next: () => {
      this.carritoEliminado = true;

      // Reinicia el estado visual después de unos segundos
      setTimeout(() => {
        this.carritoEliminado = false;
      }, 2000);
    },
    error: (err) => {
      console.error('Error al eliminar el carrito:', err);
    }
  });
}


  sumStock(){
    this.cart$
  }
 
  restStock(){
    
  }
}