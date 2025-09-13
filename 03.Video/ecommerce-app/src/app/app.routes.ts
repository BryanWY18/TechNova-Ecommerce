import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/auth/register/register.component';
import { SearchComponent } from './pages/search/search.component';

export const routes: Routes = [
  { path: '', component: RegisterComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'search', component: SearchComponent },
];
