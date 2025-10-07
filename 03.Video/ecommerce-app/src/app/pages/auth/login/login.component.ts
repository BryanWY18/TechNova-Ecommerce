import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { UserStateService } from '../../../core/user-state.service';
import { FormFieldComponent } from '../../../ui/form-field/form-field.component';
import { InputComponent } from '../../../ui/input/input.component';
import { ButtonComponent } from '../../../ui/button/button.component';

import { Store } from '@ngrx/store';
import * as AuthActions from '../../../store/auth/auth.actions';

type LoginForm = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>
}>;

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormFieldComponent, InputComponent, ButtonComponent, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loading = false;
  banner = '';
  form: LoginForm;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private userStateService: UserStateService,
    private store: Store
  ) {
    this.form = this.fb.nonNullable.group({
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
      password: this.fb.nonNullable.control('', [Validators.required]),
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.banner = '';

    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => {
        //this.userStateService.loadUser();
        this.store.dispatch(AuthActions.loadUser());
        this.loading = false;
        this.router.navigateByUrl('/');
      },
      error: (e: Error) => {
        this.loading = false;
        this.banner = e.message || 'No se pudo iniciar sesión';
      }
    });
  }
}
