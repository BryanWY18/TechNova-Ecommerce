import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth/auth.actions';
import { selectUser } from '../../store/auth/auth.selectors';
import { User } from '../../core/profile.service';
import { Observable, Subscription } from 'rxjs';
import { UserStateService } from '../../core/user-state.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit {

  user$: Observable<User | null>;
  profile: User | null = null;
  error = "";

  private userSubscription: Subscription = new Subscription();

  constructor(private route: ActivatedRoute,
    private userStateService: UserStateService,
    private store: Store) {
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    // const data = this.route.snapshot.data['profileData'];
    // if (!data) {
    //   this.error = 'No pudimos cargar tu perfil. Intenta iniciar sesión de nuevo';
    // } else {
    //   this.profile = data.user || data;
    // }
    this.store.dispatch(AuthActions.loadUser());
    this.subscribeToUserState();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  private subscribeToUserState(): void {
    this.userSubscription = this.userStateService.user$.subscribe({
      next: (user) => {
        this.profile = user;
        this.error = user ? '' : 'No hay usuario autenticado';
      },
      error: (error) => {
        console.error('Profile component - Error de subscripción', error);
        this.error = 'Error cargando el perfil del usuario';
        this.profile = null;
      }
    })
  }

}
