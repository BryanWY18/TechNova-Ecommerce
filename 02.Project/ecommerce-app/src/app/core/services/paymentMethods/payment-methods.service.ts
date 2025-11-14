import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {
  private readonly baseUrl = 'http://localhost:3000/api/payment-methods';

  constructor(private http: HttpClient) { }
}
