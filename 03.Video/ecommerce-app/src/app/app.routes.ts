import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { CategoryComponent } from './pages/category/category.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './core/auth.guard';
import { perfilResolver } from './core/perfil.resolver';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'search', component: SearchComponent },
  {
    path: 'profile', component: ProfileComponent,
    canActivate: [authGuard],
    resolve: { profileData: perfilResolver }
  },
  { path: 'category/:id', component: CategoryComponent },
  { path: 'deals', component: HomeComponent }, // Por ahora redirige a home
  { path: 'new', component: HomeComponent }, // Por ahora redirige a home
  { path: 'bestsellers', component: HomeComponent }, // Por ahora redirige a home
  { path: 'cart', component: HomeComponent }, // Por ahora redirige a home
];
