import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, catchError, map, switchMap, tap, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast/toast.service';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../store/auth/auth.selectors';
import { Wishlist, wishlistSchema } from '../../types/WishList';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
/**
  private baseUrl = `${environment.BACK_URL}/wishlist`;
  private wishlistSubject = new BehaviorSubject<Wishlist | null>(null);
  wishlist$ = this.wishlistSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private toast: ToastService,
    private store: Store
  ) {
    this.loadUserWishlist();
  }

  /**
   * Obtiene el ID del usuario autenticado desde el store
   
  getUserId(): string {
    let userId: string = '';
    this.store.select(selectUserId).pipe(take(1)).subscribe({
      next: (id) => (userId = id ?? '')
    });
    return userId;
  }

  /**
   * Carga la wishlist del usuario al inicializar el servicio
   
  loadUserWishlist() {
    const userId = this.getUserId();
    if (!userId) {
      this.wishlistSubject.next(null);
      return;
    }

    this.getUserWishlist().subscribe({
      next: (wishlist) => {
        this.wishlistSubject.next(wishlist);
      },
      error: () => {
        this.wishlistSubject.next(null);
      }
    });
  }

  
   * GET /api/wishlist - Obtiene la wishlist del usuario
  
  getUserWishlist(): Observable<Wishlist | null> {
    return this.httpClient.get(`${this.baseUrl}`).pipe(
      map((data) => {
        const response = wishlistSchema.safeParse(data);
        if (!response.success) {
          console.error('Wishlist validation error:', response.error);
          throw new Error('Invalid wishlist data');
        }
        return response.data.wishList;
      }),
      catchError((error) => {
        console.error('Error fetching wishlist:', error);
        return of(null);
      })
    );
  }

  
  /**
   * POST /api/wishlist/add - Agrega un producto a la wishlist
   
  addToWishlist(productId: string): Observable<Wishlist | null> {
    const userId = this.getUserId();
    if (!userId) {
      this.toast.error('Debes iniciar sesión para agregar a favoritos');
      return of(null);
    }

    return this.httpClient.post(`${this.baseUrl}/add`, { productId }).pipe(
      switchMap(() => this.getUserWishlist()),
      tap((wishlist) => {
        this.wishlistSubject.next(wishlist);
        this.toast.success('Producto agregado a favoritos');
      }),
      catchError((error) => {
        if (error.status === 400) {
          this.toast.success('El producto ya está en favoritos');
        } else {
          this.toast.error('Error al agregar a favoritos');
        }
        return of(null);
      })
    );
  }

  /**
   * DELETE /api/wishlist/remove/:productId - Elimina un producto de la wishlist
   
  removeFromWishlist(productId: string): Observable<Wishlist | null> {
    const userId = this.getUserId();
    if (!userId) {
      return of(null);
    }

    return this.httpClient.delete(`${this.baseUrl}/remove/${productId}`).pipe(
      switchMap(() => this.getUserWishlist()),
      tap((wishlist) => {
        this.wishlistSubject.next(wishlist);
        this.toast.success('Producto eliminado de favoritos');
      }),
      catchError((error) => {
        this.toast.error('Error al eliminar de favoritos');
        return of(null);
      })
    );
  }

  /**
   * DELETE /api/wishlist/clear - Limpia toda la wishlist
   
  clearWishlist(): Observable<Wishlist | null> {
    return this.httpClient.delete(`${this.baseUrl}/clear`).pipe(
      tap(() => {
        this.wishlistSubject.next(null);
        this.toast.success('Favoritos eliminados');
      }),
      map(() => null),
      catchError((error) => {
        this.toast.error('Error al limpiar favoritos');
        return of(null);
      })
    );
  }

  /**
   * GET /api/wishlist/check/:productId - Verifica si un producto está en la wishlist
   
  checkProductInWishlist(productId: string): Observable<boolean> {
    return this.httpClient.get(`${this.baseUrl}/check/${productId}`).pipe(
      map((data) => {
        const response = checkProductResponseSchema.safeParse(data);
        if (!response.success) {
          console.error('Check product validation error:', response.error);
          return false;
        }
        return response.data.inWishList;
      }),
      catchError(() => of(false))
    );
  }
*/
  /**
   * Verifica localmente si un producto está en la wishlist (más rápido)
   
  isInWishlist(productId: string): Observable<boolean> {
    return this.wishlist$.pipe(
      map(wishlist => {
        if (!wishlist || !wishlist.products) {
          return false;
        }
        return wishlist.products.some(item => item.product._id === productId);
      })
    );
  }
    */
  /**
   * Alterna un producto en la wishlist (agregar si no está, eliminar si está)
   
  toggleWishlist(productId: string): Observable<Wishlist | null> {
    const currentWishlist = this.wishlistSubject.value;
    
    if (!currentWishlist || !currentWishlist.products) {
      return this.addToWishlist(productId);
    }

    const isInWishlist = currentWishlist.products.some(
      item => item.product._id === productId
    );

    if (isInWishlist) {
      return this.removeFromWishlist(productId);
    } else {
      return this.addToWishlist(productId);
    }
  }

  /**
   * POST /api/wishlist/move-to-cart - Mueve un producto de la wishlist al carrito
  
  moveToCart(productId: string): Observable<boolean> {
    return this.httpClient.post(`${this.baseUrl}/move-to-cart`, { productId }).pipe(
      tap(() => {
        this.loadUserWishlist(); // Recargar la wishlist
        this.toast.success('Producto movido al carrito');
      }),
      map(() => true),
      catchError((error) => {
        this.toast.error('Error al mover al carrito');
        return of(false);
      })
    );
  }

  /**
   * Obtiene el conteo de productos en la wishlist
   
  getItemCount(): Observable<number> {
    return this.wishlist$.pipe(
      map((wishlist) => {
        if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
          return 0;
        }
        return wishlist.products.length;
      })
    );
  }
*/
}