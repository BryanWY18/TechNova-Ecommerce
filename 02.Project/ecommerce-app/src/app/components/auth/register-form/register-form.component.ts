import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {
  imagePreview: string = '';

  fb = inject(FormBuilder);
  registerForm: FormGroup;

  constructor(private authService: AuthService){
    this.registerForm = this.fb.group({
      displayName: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      phone: ['', [Validators.required, /*Validators.pattern(/^\d{10}$/),*/ this.phoneValidator()]],
      dateOfBirth: ['', [Validators.required]],
      avatar: [''],
      password:['', [Validators.required]],
      repeatPassword:['', [Validators.required]]
    },
    {
      validators: this.matchPasswordValidator('password', 'repeatPassword')
    }
  )
  }

  onImageSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files && target.files.length > 0 ? target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  matchPasswordValidator(passwordField: string, repeatPasswordField:string): ValidatorFn{
    return (formGroup:AbstractControl): ValidationErrors | null =>{
      const password = (formGroup as FormGroup).get(passwordField)?.value;
      const repeatPassword = (formGroup as FormGroup).get(repeatPasswordField)?.value;
      return password === repeatPassword? null: { doesnt_match : true }
    }
  }

  phoneValidator():ValidatorFn{
    return (formControl: AbstractControl): ValidationErrors | null =>{
      const phoneValue = formControl.value;
      console.log(phoneValue.length);
      console.log(Number.isNaN(+phoneValue));
      if (phoneValue.length!==10 || Number.isNaN(+phoneValue)) {
        return { invalid_phone: true}
      }
      return null;
    }
  }

  handleSubmit(){
    console.log(this.registerForm.value);
    this.authService.register(this.registerForm.value);
  }
}
