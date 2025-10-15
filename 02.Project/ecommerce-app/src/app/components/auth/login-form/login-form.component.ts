import { Component, inject } from '@angular/core';
import { 
  FormGroup, 
  FormControl, 
  FormBuilder, 
  Validators, 
  AbstractControl, 
  AsyncValidatorFn,
  ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FormFieldComponent } from "../../shared/form-field/form-field.component";
import { of, debounceTime, switchMap, catchError } from 'rxjs';

@Component({
  selector: 'app-login-form',
  standalone:true,
  imports: [FormFieldComponent, RouterLink, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {

  fb = inject(FormBuilder); 
  registerForm: FormGroup;

  fields = [
    {
      label: 'email',
      fieldId: 'email',
      type: 'email',
      placeholder: 'example@example.com',
      required: true,
    },
    {
      label: 'contraseña',
      fieldId: 'password',
      type: 'password',
      placeholder: '*******',
      required: true,
    }
  ];

  constructor(private authService: AuthService) {
    this.registerForm = this.fb.group(
      {
        email: [
          '',
          [Validators.email, Validators.required],
          [this.emailAsycValidator()],
        ],
        password: ['', [Validators.required]],
      },
    );
  }

  emailAsycValidator(): AsyncValidatorFn {
    // const auth = inject(AuthService);
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null);
      }
      console.log(control.value);
      return this.authService.checkEmailExist(control.value).pipe(
        debounceTime(500),
        switchMap((exist) => (exist ? of({ emailTaken: true }) : of(null))),
        catchError(() => of({ cantFetch: true }))
      );
    };
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control || !control.touched) {
      return '';
    }
    if (control.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control.hasError('email')) {
      return 'Email no valido';
    }
    if (control.hasError('emailTaken')) {
      return 'Este usuario ya existe';
    }
    if (control.hasError('cantFetch')) {
      return 'Error del servidor, intente en otro momento';
    }
    if (control.hasError('password')) {
      return 'Contraseña no valida';
    }
    return '';
  }

  handleSubmit() {
    console.log(this.registerForm.value);
    this.authService.register(this.registerForm.value);
  }
}
