import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../toast/toast.service';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../store/auth/auth.selectors';
import { environment } from '../../../../environments/environment';
import { CreateOrder, Order, OrderSchema } from '../../types/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `${environment.BACK_URL}/orders`;
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

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

  createOrder(orderData: CreateOrder): Observable<Order> {
    return this.httpClient.post<Order>(`${this.baseUrl}`, orderData).pipe(
      tap((order) => {
        this.refreshUserOrders();
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getOrdersByUserId(userId: string): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${this.baseUrl}/user/${userId}`).pipe(
      tap((orders) => {
        this.ordersSubject.next(orders);
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }

  getOrderById(orderId: string): Observable<Order | null> {
    return this.httpClient.get<Order>(`${this.baseUrl}/${orderId}`).pipe(
      catchError((error) => {
        return of(null);
      })
    );
  }

  updateOrderStatus(orderId: string, status: string): Observable<Order | null> {
    return this.httpClient.patch<Order>(`${this.baseUrl}/${orderId}/status`, { status }).pipe(
      tap(() => {
        this.toast.success('Estado de la orden actualizado');
        this.refreshUserOrders();
      }),
      catchError((error) => {
        return of(null);
      })
    );
  }

  getAllOrders(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${this.baseUrl}`).pipe(
      catchError((error) => {
        return of([]);
      })
    );
  }

  updateOrder(orderId: string, orderData: Partial<Order>): Observable<Order | null> {
    return this.httpClient.put<Order>(`${this.baseUrl}/${orderId}`, orderData).pipe(
      tap(() => {
        this.toast.success('Orden actualizada exitosamente');
        this.refreshUserOrders();
      }),
      catchError((error) => {
        return of(null);
      })
    );
  }

  refreshUserOrders(): void {
    const userId = this.getUserId();
    if (userId) {
      this.getOrdersByUserId(userId).subscribe();
    }
  }

  /**
  cancelOrder(orderId: string): Observable<Order | null> {
    return this.httpClient.patch<Order>(`${this.baseUrl}/${orderId}`).pipe(
      tap(() => {
        this.toast.success('Orden cancelada exitosamente');
        this.refreshUserOrders();
      }),
      catchError((error) => {
        return of(null);
      })
    );
  }
  */
}