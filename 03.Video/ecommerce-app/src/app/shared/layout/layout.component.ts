import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../core/auth.service';
//import { ProductService } from '../../core/product.service';
import { ThemeService } from '../../core/theme.service';
import { UserStateService } from '../../core/user-state.service';
import { User } from '../../core/profile.service';
// NgRx Imports
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth/auth.actions';
import { selectUser } from '../../store/auth/auth.selectors';

// UI Components
import { SearchBarComponent } from '../../ui/search-bar/search-bar.component';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { CartButtonComponent } from '../../ui/cart-button/cart-button.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { IconComponent } from '../../ui/icon/icon.component';
import { ThemeToggleComponent } from '../../ui/theme-toggle/theme-toggle.component';

interface Category {
  _id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    SearchBarComponent,
    DropdownComponent,
    CartButtonComponent,
    ButtonComponent,
    IconComponent,
    ThemeToggleComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit, OnDestroy {
  searchQuery = '';
  categories: Category[] = [{ _id: '12', name: 'Todo', description: 'Todo' }];
  //user: User | null = null;
  showUserMenu = false;
  showCategoriesMenu = false;
  showMobileMenu = false;

  private userSubscription: Subscription = new Subscription();

  user$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    //private productService: ProductService,
    private router: Router,
    private themeService: ThemeService,
    private userStateService: UserStateService,
    private store: Store
  ) {
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit() {
    // Initialize theme
    this.themeService.init();
    //this.loadCategories();

    //Suscribirse al estado reactivo del usuario
    //this.subscribeToUserState();
    //Cargar el usuario inicial
    //this.userStateService.loadUser();

    this.store.dispatch(AuthActions.loadUser());

    // Check initial screen size
    this.checkScreenSize();
  }

  ngOnDestroy() {
    // Cleanup if needed
    // this.userSubscription.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    const isMobile = window.innerWidth <= 768;

    // Close mobile menu when switching to desktop
    if (!isMobile && this.showMobileMenu) {
      this.showMobileMenu = false;
    }

    // Close desktop menus when switching to mobile
    if (isMobile && (this.showUserMenu || this.showCategoriesMenu)) {
      this.showUserMenu = false;
      this.showCategoriesMenu = false;
    }
  }

  loadCategories() {
    //  this.productService.getCategories().subscribe({
    //    next: (categories) => {
    //      this.categories = categories;
    //    },
    //    error: (error) => {
    //      console.error('Error loading categories:', error);
    //    }
    //  });
  }


  /**
   * Suscribirse al estado reactivo del usuario
   */
  // private subscribeToUserState() {
  //   this.userSubscription = this.userStateService.user$.subscribe({
  //     next: (user) => {
  //       this.user = user;
  //       console.log('Estado del usuario actualizado en el Layout', user);
  //     },
  //     error: (error) => {
  //       console.error('Error en la suscripción del usuario', error);
  //     }
  //   })
  // }

  onSearch(query: string) {
    if (query.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: query }
      });
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showCategoriesMenu = false;
  }

  toggleCategoriesMenu() {
    this.showCategoriesMenu = !this.showCategoriesMenu;
    this.showUserMenu = false;
  }

  selectCategory(category: Category) {
    this.showCategoriesMenu = false;
    this.router.navigate(['/category', category._id]);
  }

  logout() {
    //this.authService.logout();
    //this.userStateService.clearUser();
    this.store.dispatch(AuthActions.logout());
    this.showUserMenu = false;
    this.router.navigate(['/']);
  }

  closeMenus() {
    this.showUserMenu = false;
    this.showCategoriesMenu = false;
    this.showMobileMenu = false;
  }

  // Mobile menu methods
  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
    // Close other menus when opening mobile menu
    if (this.showMobileMenu) {
      this.showUserMenu = false;
      this.showCategoriesMenu = false;
    }
  }

  closeMobileMenu() {
    this.showMobileMenu = false;
  }
}
