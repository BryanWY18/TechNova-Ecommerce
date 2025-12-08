import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { Wishlist } from '../../types/WishList';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../toast/toast.service';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../store/auth/auth.selectors';
import { environment } from '../../../../environments/environment';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WishListService {
  private baseUrl = `${environment.BACK_URL}/wishlist`;
  private wishlistSubject = new BehaviorSubject<Wishlist | null>(null);
  public wishlist$ = this.wishlistSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private toast: ToastService,
    private store: Store,
  ) { }

  getUserId(): string {
    let userId = '';
    this.store
      .select(selectUserId)
      .pipe(take(1))
      .subscribe({ next: (id) => (userId = id ?? '') });
    return userId;
  }

  // Obtener wishlist por usuario
  getWishlistByUserId(userId: string): Observable<Wishlist | null> {
    return this.httpClient.get<Wishlist>(`${this.baseUrl}/user/${userId}`).pipe(
      tap((wishlist) => {
        this.wishlistSubject.next(wishlist);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.wishlistSubject.next(null);
          return of(null);
        }
      return throwError(() => error);
      })
    );
  }

  // Crear wishlist
  createWishlist(userId: string): Observable<Wishlist | null> {
    return this.httpClient.post<Wishlist>(`${this.baseUrl}`, { user: userId }).pipe(
      tap((wishlist) => {
        this.toast.success('Wishlist creada');
        this.wishlistSubject.next(wishlist);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  // Agregar producto a wishlist
  addProductToWishlist(productId: string, quantity: number = 1): Observable<Wishlist | null> {
    const userId = this.getUserId();
    return this.httpClient.post<Wishlist>(`${this.baseUrl}/${userId}/add`, {
      productId,
      quantity
    }).pipe(
      tap((wishlist) => {
        this.toast.success('Producto agregado a favoritos');
        this.wishlistSubject.next(wishlist);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  // Remover producto de wishlist
  removeFromWishlist(productId: string): Observable<Wishlist | null> {
    const userId = this.getUserId();
    return this.httpClient.delete<Wishlist>(`${this.baseUrl}/${userId}/remove/${productId}`).pipe(
      tap((wishlist) => {
        this.toast.success('Producto removido de favoritos');
        this.wishlistSubject.next(wishlist);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  // Actualizar cantidad de producto en wishlist
  updateProductQuantity(productId: string, quantity: number): Observable<Wishlist | null> {
    const userId = this.getUserId();
    return this.httpClient.patch<Wishlist>(`${this.baseUrl}/${userId}/update`, {
      productId,
      quantity
    }).pipe(
      tap((wishlist) => {
        this.toast.success('Cantidad actualizada');
        this.wishlistSubject.next(wishlist);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  // Limpiar wishlist completa
  clearWishlist(): Observable<Wishlist | null> {
    const userId = this.getUserId();
    return this.httpClient.delete<Wishlist>(`${this.baseUrl}/${userId}/clear`).pipe(
      tap(() => {
        this.toast.success('Wishlist limpiada');
        this.wishlistSubject.next(null);
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  // Mover producto de wishlist a carrito
  moveToCart(productId: string): Observable<boolean> {
    const userId = this.getUserId();
    return this.httpClient.post<{ success: boolean }>(`${this.baseUrl}/${userId}/move-to-cart/${productId}`, {}).pipe(
      map(() => {
        this.toast.success('Producto movido al carrito');
        this.refreshWishlist();
        return true;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  // Verificar si un producto está en la wishlist
  isProductInWishlist(productId: string): Observable<boolean> {
    return this.wishlist$.pipe(
      map((wishlist) => {
        if (!wishlist || !wishlist.products) return false;
        return wishlist.products.some(item => item.product._id === productId);
      })
    );
  }

  // Obtener cantidad de productos en wishlist
  getWishlistCount(): Observable<number> {
    return this.wishlist$.pipe(
      map((wishlist) => {
        if (!wishlist || !wishlist.products) return 0;
        return wishlist.products.length;
      })
    );
  }

  // Refrescar wishlist del usuario actual
  refreshWishlist(): void {
    const userId = this.getUserId();
    if (userId) {
      this.getWishlistByUserId(userId).subscribe();
    }
  }

  // Limpiar estado local
  clearLocalWishlist(): void {
    this.wishlistSubject.next(null);
  }
  
}