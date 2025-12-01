import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { FormFieldComponent } from '../../../components/shared/form-field/form-field.component';
import * as AuthActions from '../../../core/store/auth/auth.actions';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-shipping-address',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, RouterLink],
  templateUrl: './shipping-address.component.html',
  styleUrl: './shipping-address.component.css'
})
export class ShippingAddressComponent {

  imagePreview: string = '';

  fb = inject(FormBuilder);
  registerForm: FormGroup;

  fields = [
    {
      label: 'Dirección',
      fieldId: 'address',
      type: 'text',
      placeholder: 'Calle y número',
      required: true,
    },
    {
      label: 'Ciudad',
      fieldId: 'city',
      type: 'text',
      placeholder: 'Ciudad',
      required: true,
    },
    {
      label: 'Estado',
      fieldId: 'state',
      type: 'text',
      placeholder: 'Estado',
      required: true,
    },
    {
      label: 'Codigo Postal',
      fieldId: 'postalCode',
      type: 'number',
      placeholder: 'Código postal',
      required: true,
    },
    {
      label: 'Pais',
      fieldId: 'country',
      type: 'text',
      placeholder: 'País',
      required: true,
    },
  ];

  constructor(private store:Store) {
    this.registerForm = this.fb.group(
      {
        address: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        postalCode: ['',[Validators.required, this.postalValidator()]],
        country: ['', [Validators.required]],
      },
    );
  }

  postalValidator(): ValidatorFn {
    return (formControl: AbstractControl): ValidationErrors | null => {
      const postalValue = formControl.value;
      console.log(postalValue.length);
      console.log(Number.isNaN(+postalValue));
      if (postalValue.length !== 5 || Number.isNaN(+postalValue)) {
        return { invalid_postalCode: true };
      }
      return null;
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
    if (control.hasError('cantFetch')) {
      return 'Error del servidor, intente en otro momento';
    }
    if (control.hasError('invalid_postalCode')) {
      return 'Código postal no valido';
    }
    return '';
  }

  handleSubmit() {
    console.log(this.registerForm.value);
    // this.authService.register(this.registerForm.value);
    this.store.dispatch(AuthActions.register({userData:this.registerForm.value}));
  }
}
