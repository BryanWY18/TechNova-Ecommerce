import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FormErrorService } from '../../../core/services/validation/form-error.service';
import { RouterLink } from '@angular/router';
import { FormFieldComponent } from "../../shared/form-field/form-field.component";


@Component({
  selector: 'app-login-form',
<<<<<<< HEAD
  imports: [ReactiveFormsModule, RouterLink, FormFieldComponent],
=======
  standalone: true,
  imports: [FormFieldComponent, ReactiveFormsModule, RouterLink],
>>>>>>> bd5d69308416c649a2ff2995997a8d678ec655b2
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  fb = inject(FormBuilder);
  loginForm: FormGroup;

  constructor(private validation: FormErrorService, private authService:AuthService){
    this.loginForm = this.fb.group({
      email:['', [Validators.required, Validators.email]], 
      password:['', Validators.required]
    })
  }
  getErrorMessage(fieldName:string){
    const loginLabels = {
      email: 'email',
      password: 'contraseña'
    }
    return this.validation.getFieldError(this.loginForm, fieldName, loginLabels)
  }

  handleSubmit(){
    console.log(this.loginForm.value);
    this.authService.login(this.loginForm.value);
  }
}
