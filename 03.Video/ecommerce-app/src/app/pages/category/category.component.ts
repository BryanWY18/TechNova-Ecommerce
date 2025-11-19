import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../core/product.service';
import { ProductGridComponent } from '../../ui/product-grid/product-grid.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, ProductGridComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  categoryId = '';
  categoryName = '';
  error = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoryId = params['id'];
      if (this.categoryId) {
        this.loadProductsByCategory();
      }
    });
  }

  loadProductsByCategory() {
    this.loading = true;
    this.error = '';

    this.productService.getByCategory(this.categoryId).subscribe({
      next: (products) => {
        this.products = products;
        if (products.length > 0) {
          this.categoryName = products[0].category.name;
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  onProductClick(product: Product) {
    // Navigate to product detail page
    this.router.navigate(['/product', product._id]);
  }

  onAddToCart(product: Product) {
    // Add product to cart logic
    console.log('Adding to cart:', product);
    // TODO: Implement cart service
  }
}
