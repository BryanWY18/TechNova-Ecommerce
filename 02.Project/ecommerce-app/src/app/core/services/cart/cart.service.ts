import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Cart, cartSchema } from '../../types/Cart';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = 'http://localhost:3000/api/cart';
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private toast: ToastService,
  ) {
    this.loadUserCart();
  }

  getUserId(): string | null {
    // const id = ''
    // if (id) {
    //   return id;
    // }
    // else{
    //   return 'IdGenerico'
    // };

    // return id ? id.toUpperCase() : 'IdGenerico';
    // return id ?? 'IdGenrico'
    return this.authService.decodedToken?.userId ?? null;
  }

  getCartByUserId(userId: string): Observable<Cart | null> {
    return this.httpClient.get(`${this.baseUrl}/user/${userId}`).pipe(
      map((data) => {
        const response = cartSchema.safeParse(data);
        if (!response.success) {
          console.log(response.error);
          throw new Error(`${response.error}`);
        }
        return response.data;
      })
    );
  }

  loadUserCart(){
    const id = this.getUserId();
    if (!id) {
      this.cartSubject.next(null);
      return;
    }

    this.getCartByUserId(id).subscribe({
      next: (cart)=>{
        this.cartSubject.next(cart);
      },
      error: (error)=>{
        this.cartSubject.next(null);
      }
    })
  }


  addToCart(productId: string, quantity: number =1):Observable<Cart | null>{
    const userId= this.getUserId();
    if (!userId) {
      console.log('usuario no autentificado');
      return of(null);
    }
    const payload = {
      userId,
      productId,
      quantity
    }
    return this.httpClient.post(`${this.baseUrl}/add-product`, payload).pipe(
      switchMap( ()=>this.getCartByUserId(userId) /*()=>{return this.getCartByUserId(userId)}*/),
      tap((updatedCart)=>{
        this.toast.success('Producto agregado al carrito');
        this.cartSubject.next(updatedCart);
      }),
      catchError((error)=>{
        return of(null);
      })
    )
  }

  

}
