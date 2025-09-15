import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/auth/register/register.component';
import { SearchComponent } from './pages/search/search.component';
import { LoginComponent } from './pages/auth/login/login.component';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'search', component: SearchComponent },
];
