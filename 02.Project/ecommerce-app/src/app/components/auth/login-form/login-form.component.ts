import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FormErrorService } from '../../../core/services/validation/form-error.service';
import { RouterLink } from '@angular/router';
import { FormFieldComponent } from "../../shared/form-field/form-field.component";


@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, RouterLink, FormFieldComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {

  fb=inject(FormBuilder);

  loginForm:FormGroup;

  constructor(private validation:FormErrorService){
    this.loginForm=this.fb.group({
      email:['',[Validators.required, Validators.email]],
      password:['',Validators.required]
    })
  }
    
  getErrorMessage(fieldName:string){
    const loginLabels={
      email:'email',
      password:'contraseña'
    }
    return this.validation.getFieldError(this.loginForm,fieldName,loginLabels);
  }

  handleSubmit(){
    console.log(this.loginForm.value);
  }

}
