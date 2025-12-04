import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';
import {
  CreateShippingAddress,
  ShippingAddress,
  ShippingAddressArraySchema,
  UpdateShippingAddressMethod,
} from '../../types/ShippingAddress';
import { Store } from '@ngrx/store';
import { selectUserId } from '../../store/auth/auth.selectors';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class ShippingAddressService {
  private readonly baseUrl = `${environment.BACK_URL}/shipping-address`;
  private shippingAddressSubject = new BehaviorSubject<ShippingAddress[]>([]);
  readonly shippingAddresses$ = this.shippingAddressSubject.asObservable();

  constructor( private http: HttpClient, private store: Store, private toast: ToastService) {}

  /**
   * Obtiene el ID del usuario autenticado desde el store
   */
  getUserId(): string {
    let userId = '';
    this.store
      .select(selectUserId)
      .pipe(take(1))
      .subscribe({ next: (id) => (userId = id ?? '') });
    return userId;
  }

  /**
   * GET /shipping-address/user/:userId - Obtiene todas las direcciones de un usuario
   */
  getShippingAddressesByUser(userId: string): Observable<ShippingAddress[]> {
    return this.http.get(`${this.baseUrl}/user/${userId}`).pipe(
      map((data: any) => {
        console.log('Data recibida:', data)
        const response = ShippingAddressArraySchema.safeParse(data.addresses);
        if (!response.success) {
          console.error('Shipping address validation error:', response.error);
          return [];
        }
        return response.data;
      })
    );
  }

  /**
   * POST /shipping-address - Crea una nueva dirección de envío
   */
  createShippingAddress(data: CreateShippingAddress): Observable<ShippingAddress[]> {
    const user = this.getUserId();
    const payload = {
      user,
      ...data,
    };
    return this.http.post(this.baseUrl, payload).pipe(
      switchMap(() => this.getShippingAddressesByUser(user)),
      tap((updatedData) => {
        this.shippingAddressSubject.next(updatedData);
        this.toast.success('Dirección de envío agregada');
      })
    );
  }

  /**
   * PUT /shipping-address/:id - Actualiza una dirección de envío
   */
  updateShippingAddress(
    updatedAddressData: UpdateShippingAddressMethod
  ): Observable<ShippingAddress[]> {
    const userId = this.getUserId();
    return this.http
      .put(`${this.baseUrl}/${updatedAddressData._id}`, updatedAddressData)
      .pipe(
        switchMap(() => this.getShippingAddressesByUser(userId)),
        tap((updatedData) => {
          this.shippingAddressSubject.next(updatedData);
          this.toast.success('Dirección de envío actualizada');
        })
      );
  }

  /**
   * DELETE /shipping-address/:id - Elimina una dirección de envío
   */
  deleteShippingAddress(addressId: string): Observable<ShippingAddress[]> {
    const user = this.getUserId();
    return this.http.delete(`${this.baseUrl}/${addressId}`).pipe(
      switchMap(() => this.getShippingAddressesByUser(user)),
      tap((updatedData) => {
        this.shippingAddressSubject.next(updatedData);
        this.toast.success('Dirección de envío eliminada');
      })
    );
  }

  /**
   * PATCH - Establece una dirección como predeterminada
   */
  setDefaultShippingAddress(addressId: string): Observable<ShippingAddress[]> {
    const userId = this.getUserId();
    return this.http.patch(`${this.baseUrl}/${addressId}/default`, {}).pipe(
      switchMap(() => this.getShippingAddressesByUser(userId)),
      tap((updatedData) => {
        this.shippingAddressSubject.next(updatedData);
        this.toast.success('Dirección predeterminada actualizada');
      })
    );
  }

  /**
   * Carga las direcciones del usuario al inicializar el servicio
   */
  loadUserShippingAddresses(): void {
    const userId = this.getUserId();
    if (!userId) {
      this.shippingAddressSubject.next([]);
      return;
    }
    this.getShippingAddressesByUser(userId).subscribe({
      next: (addresses) => {
        this.shippingAddressSubject.next(addresses);
      },
      error: () => {
        this.shippingAddressSubject.next([]);
      },
    });
  }

  /**
   * Obtiene la dirección predeterminada del usuario
   */
  getDefaultAddress(): Observable<ShippingAddress | null> {
    return this.shippingAddresses$.pipe(
      map((addresses) => {
        const defaultAddress = addresses.find((addr) => addr.isDefault);
        return defaultAddress || null;
      })
    );
  }

}