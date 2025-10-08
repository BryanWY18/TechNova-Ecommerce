import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchProductsComponent } from "./components/products/search-products/search-products.component";
import { AsideComponent } from "./layout/aside/aside.component";
import { ToastComponent } from "./components/shared/toast/toast.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SearchProductsComponent, AsideComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ecommerce-app';
}
