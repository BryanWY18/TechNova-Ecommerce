import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  _id: string;
  name: string;
  description: string;
  imageURL: string;
  parentCategory: string | null;
}

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imagesUrl: string[];
  category: Category;
};

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private base = environment.apiBase; // p.ej. http://localhost:3000/api

  getAll() {
    return this.http.get<{ products: Product[] }>(`${this.base}/products`).pipe(
      catchError((err) => {
        const msg =
          err?.error?.message || 'No se pudieron obtener los productos';
        return throwError(() => new Error(msg));
      })
    );
  }

  getById(id: string) {
    return this.http.get<Product>(`${this.base}/products/${id}`).pipe(
      catchError((err) => {
        const msg = err?.error?.message || 'No se pudo obtener el producto';
        return throwError(() => new Error(msg));
      })
    );
  }

  getByCategory(categoryId: string) {
    return this.http
      .get<Product[]>(`${this.base}/products/category/${categoryId}`)
      .pipe(
        catchError((err) => {
          const msg =
            err?.error?.message ||
            'No se pudieron obtener los productos de la categoría';
          return throwError(() => new Error(msg));
        })
      );
  }

  search(query: string) {
    return this.http
      .get<{ products: Product[] }>(
        `${this.base}/products/search?q=${encodeURIComponent(query)}`
      )
      .pipe(
        catchError((err) => {
          const msg = err?.error?.message || 'No se pudieron buscar productos';
          return throwError(() => new Error(msg));
        })
      );
  }

  getCategories() {
    return this.http
      .get<{ _id: string; name: string; description: string }[]>(
        `${this.base}/categories`
      )
      .pipe(
        catchError((err) => {
          const msg =
            err?.error?.message || 'No se pudieron obtener las categorías';
          return throwError(() => new Error(msg));
        })
      );
  }
}
