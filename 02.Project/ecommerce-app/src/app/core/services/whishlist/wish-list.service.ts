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
import { Wishlist, wishlistResponseSchema } from '../../types/WishList';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../toast/toast.service';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../store/auth/auth.selectors';
import { environment } from '../../../../environments/environment';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  private baseUrl = `${environment.BACK_URL}/wishlist`;
  private wishlistSubject = new BehaviorSubject<Wishlist | null>(null);
  public wishlist$ = this.wishlistSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toast: ToastService,
    private store: Store
  ) {}

  getUserId(): string {
    let userId = '';
    this.store
      .select(selectUserId)
      .pipe(take(1))
      .subscribe({ next: (id) => (userId = id ?? '') });
    return userId;
  }

  getWishlistByUserId(userId: string): Observable<Wishlist | null> {
    return this.http.get(`${this.baseUrl}/user`).pipe(
      map((data: any) => {
        const response = wishlistResponseSchema.safeParse(data);
        if (!response.success) {
          console.error('WishList validation error:', response.error);
          return null;
        }
        return response.data.wishList;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error al obtener wishlist:', error);
        return of(null);
      })
    );
  }

  addProductToWishlist(productId: string): Observable<Wishlist | null> {
    const payload = { productId };
    return this.http.post(`${this.baseUrl}/add`, payload).pipe(
      map((data: any) => {
        const response = wishlistResponseSchema.safeParse(data);
        if (!response.success) {
          console.error('Validation error:', response.error);
          return null;
        }
        return response.data.wishList;
      }),
      tap((wishlist) => {
        if (wishlist) {
          this.toast.success('Producto agregado a favoritos');
          this.wishlistSubject.next(wishlist);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.toast.error(error.error?.message || 'Error al agregar producto');
        return throwError(() => error);
      })
    );
  }

  removeFromWishlist(productId: string): Observable<Wishlist | null> {
    return this.http.delete(`${this.baseUrl}/remove/${productId}`).pipe(
      map((data: any) => {
        const response = wishlistResponseSchema.safeParse(data);
        if (!response.success) {
          return null;
        }
        return response.data.wishList;
      }),
      tap((wishlist) => {
        if (wishlist) {
          this.toast.success('Producto eliminado de favoritos');
          this.wishlistSubject.next(wishlist);
        }
      })
    );
  }

  clearWishlist(): Observable<Wishlist | null> {
    return this.http.delete(`${this.baseUrl}/clear`).pipe(
      map((data: any) => {
        const response = wishlistResponseSchema.safeParse(data);
        if (!response.success) {
          return null;
        }
        return response.data.wishList;
      }),
      tap((wishlist) => {
        if (wishlist) {
          this.toast.success('Lista de deseos vaciada');
          this.wishlistSubject.next(wishlist);
        }
      })
    );
  }

  moveToCart(productId: string): Observable<Wishlist | null> {
    return this.http.post(`${this.baseUrl}/move-to-cart`, { productId }).pipe(
      map((data: any) => {
        const response = wishlistResponseSchema.safeParse(data);
        if (!response.success) {
          return null;
        }
        return response.data.wishList;
      }),
      tap((wishlist) => {
        if (wishlist) {
          this.toast.success('Producto movido al carrito');
          this.wishlistSubject.next(wishlist);
        }
      })
    );
  }
  
  loadWishList(userId: string): void {
    this.getWishlistByUserId(userId).subscribe({
      next: (wishlist) => this.wishlistSubject.next(wishlist),
      error: (err) => console.error('Error loading wishlist:', err)
    });
  }
}