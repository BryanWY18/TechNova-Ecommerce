import { Component, inject } from '@angular/core';
import { FormFieldComponent } from '../../shared/form-field/form-field.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FormErrorService } from '../../../core/services/validation/form-error.service';
import { RouterLink } from '@angular/router';
import { canComponentDeactivate } from '../../../core/guards/form/form.guard';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormFieldComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent implements canComponentDeactivate{
  private fb = inject(FormBuilder);
  loginForm: FormGroup;

  constructor(private validation: FormErrorService, private authService:AuthService){
    this.loginForm = this.fb.group({
      email:['', [Validators.required, Validators.email]], 
      password:['', Validators.required]
    })
  }
  canDeactivate() : Observable<boolean> | Promise<boolean> | boolean{
    if (this.loginForm.pristine /*&& this.loginForm.touched*/) {
      return true;
    }
    return confirm('Tienes cambios sin guardar. \n ¿Estás seguro de que quieres salir?');
  };

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
