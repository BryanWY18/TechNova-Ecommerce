import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Product, ProductService } from '../../core/product.service.js';

@Component({
    selector: 'app-search',
    imports: [CommonModule],
    templateUrl: './search.component.html',
    styleUrl: './search.component.css'
})

export class SearchComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  searchQuery = '';
  error = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      if (this.searchQuery) {
        this.searchProducts();
      }
    })
  }

  searchProducts() {
    this.loading = true;
    this.error = '';

    this.productService.search(this.searchQuery).subscribe({
      next: (response) => {
        this.products = response.products;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }
}
