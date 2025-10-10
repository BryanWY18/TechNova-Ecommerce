import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/auth/register/register.component';
import { SearchComponent } from './pages/search/search.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './core/auth.guard';
import { perfilResolver } from './core/perfil.resolver';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'search', component: SearchComponent },
  {
    path: 'profile', component: ProfileComponent,
    canActivate: [authGuard],
    resolve: { profileData: perfilResolver }
  },
];
