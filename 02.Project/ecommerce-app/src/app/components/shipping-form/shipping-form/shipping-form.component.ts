import { Component, EventEmitter, inject, Output } from '@angular/core';
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
import { Store } from '@ngrx/store';
import { ShippingAddress } from '../../../core/types/ShippingAddress';

@Component({
  selector: 'app-shipping-form',
  imports: [ReactiveFormsModule, FormFieldComponent],
  templateUrl: './shipping-form.component.html',
  styleUrl: './shipping-form.component.css'
})
export class ShippingFormComponent {

  @Output() ShippingAddressSaved = new EventEmitter<ShippingAddress>();

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
      label: 'Nombre de usuario',
      fieldId: 'name',
      type: 'text',
      placeholder: 'Nombre',
      required: true,
    },
    {
      label: 'Telefono',
      fieldId: 'phone',
      type: 'text',
      placeholder: '1234567890',
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
        name: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.minLength(10)]],
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
    this.ShippingAddressSaved.emit(this.registerForm.value);
  }

}
