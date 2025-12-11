import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WishListService } from '../../../core/services/whishlist/wish-list.service';
import { Wishlist } from '../../../core/types/WishList';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast/toast.service';
import { CartService } from '../../../core/services/cart/cart.service';

@Component({
  selector: 'app-wish-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent implements OnInit {
  wishList$: Observable<Wishlist | null> = of(null);
  
  constructor(
    private wishListService: WishListService, 
    private toast: ToastService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist() {
    const userId = this.wishListService.getUserId();
    this.wishList$ = this.wishListService.getWishlistByUserId(userId);
  }
  
  removeFromList(productId: string) {
    this.wishListService.removeFromWishlist(productId)
      .subscribe({
        next: () => this.loadWishlist(),
        error: (err) => console.error('Error al eliminar:', err)
      });
  }

  moveToCart(productId: string) {
    this.toast.success('Producto movido al carrito')
    this.wishListService.moveToCart(productId)
      .subscribe({
        next: () => {
          this.loadWishlist(),
          this.cartService.loadUserCart();
        },
        error: (err) => console.error('Error al mover al carrito:', err)
      });
  }

  isOutOfStock(stock: number): boolean {
    return stock === 0;
  }

  isLowStock(stock: number): boolean {
    return stock <= 5 && stock > 0;
  }

  cleanList() {
    this.wishListService.clearWishlist()
      .subscribe({
        next: () => this.loadWishlist(),
        error: (err) => console.error('Error al limpiar:', err)
      });
  }

}