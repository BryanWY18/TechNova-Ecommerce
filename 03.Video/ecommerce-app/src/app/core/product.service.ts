import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from "../../environments/environment";

export interface Product {
  _id: string,
  name: string,
  description: string,
  price: number,
  stock: number,
  imagesUrl: string[],
  category: {
    _id: string,
    name: string,
    description: string,
    imageUrl: string,
    parentCategory?: string,
  };
};

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private base = environment.apiBase;

  search(query: string) {
    return this.http.get<{ products: Product[] }>(`${this.base}/products/search?q=${encodeURIComponent(query)}`)
      .pipe(
        catchError(err => {
          const msg = err?.error?.message || 'No se pudieron buscar productos';
          return throwError(() => new Error(msg));
        })
      )
  }
}

