import { Component, signal } from '@angular/core';
import { LayoutComponent } from './shared/layout/layout.component';

@Component({
    selector: 'app-root',
    imports: [LayoutComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  protected readonly title = signal('ecommerce-app');
}
