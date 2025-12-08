import { Component, OnInit } from '@angular/core';
import { Observable, of, take } from 'rxjs';
import { WishListService } from '../../../core/services/whishlist/wish-list.service';
import { Wishlist } from '../../../core/types/WishList';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wish-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent implements OnInit {

  wishList$: Observable<Wishlist | null> = of(null);
  
  constructor(private wishListService: WishListService) {}

  ngOnInit(): void {

  }
  
  removeFromList(productId: string) {
    this.wishListService.removeFromWishlist(productId).subscribe();
  }

  // Verificar si el producto está agotado
   
  isOutOfStock(stock: number): boolean {
    return stock === 0;
  }

  
  // Verificar si el stock es bajo
  
  isLowStock(stock: number): boolean {
    return stock <= 5 && stock > 0;
  }

  cleanList() {
    this.wishListService.clearWishlist().pipe(take(1)).subscribe();
  }

}