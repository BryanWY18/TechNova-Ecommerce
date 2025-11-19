import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../core/product.service';
import { ProductGridComponent } from '../../ui/product-grid/product-grid.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { CardComponent } from '../../ui/card/card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ProductGridComponent,
    ButtonComponent,
    CardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private productService = inject(ProductService);
  private router = inject(Router);

  products: Product[] = [];
  featuredProducts: Product[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.error = null;

    this.productService.getAll().subscribe({
      next: (response) => {
        this.products = response.products || [];
        // Tomar los primeros 8 productos como destacados
        this.featuredProducts = this.products.slice(0, 8);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'No se pudieron cargar los productos';
        this.isLoading = false;
      }
    });
  }

  get uniqueCategories() {
    const categories = this.products.map(p => p.category);
    const unique = categories.filter((category, index, self) =>
      self.findIndex(c => c._id === category._id) === index
    );
    return unique.slice(0, 6); // Mostrar máximo 6 categorías
  }

  onProductClick(product: Product) {
    this.router.navigate(['/products', product._id]);
  }

  onAddToCart(product: Product) {
    // TODO: Implementar lógica del carrito
    console.log('Añadir al carrito:', product.name);
    // Aquí se podría mostrar una notificación o actualizar el estado del carrito
  }

  navigateToProducts() {
    this.router.navigate(['/products']);
  }

  navigateToCategory(categoryId: string) {
    this.router.navigate(['/categories', categoryId]);
  }

  onImageError(event: any) {
    // Imagen de fallback si la imagen de la categoría no se puede cargar
    event.target.src = '/assets/images/category-placeholder.jpg';
  }
}
