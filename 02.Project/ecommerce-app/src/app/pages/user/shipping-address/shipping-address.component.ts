import { Component } from '@angular/core';
import { ShippingFormComponent } from '../../../components/shipping-form/shipping-form/shipping-form.component';
import { ShippingAddress } from '../../../core/types/ShippingAddress';
import { Observable } from 'rxjs';
import { ShippingAddressService } from '../../../core/services/shipping-address/shipping-address.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipping-address',
  standalone: true,
  imports: [CommonModule, ShippingFormComponent],
  templateUrl: './shipping-address.component.html',
  styleUrl: './shipping-address.component.css'
})
export class ShippingAddressComponent {

  shippingAddresses$!: Observable<ShippingAddress[]>;
  selectedAddress: ShippingAddress | null = null;
  isEditMode: boolean = false;
  showForm: boolean = false;

  constructor(private shippingAddressService: ShippingAddressService) {}

  ngOnInit(): void {
    this.shippingAddressService.loadUserShippingAddresses();
    this.shippingAddresses$ = this.shippingAddressService.shippingAddresses$;
  }
  
  onAddNew(): void {
    this.selectedAddress = null;
    this.isEditMode = false;
    this.showForm = true;
  }

  onEdit(shipping: ShippingAddress): void {
    this.selectedAddress = shipping;
    this.isEditMode = true;
    this.showForm = true;
  }

  onShippingSaved(shippingData: ShippingAddress): void {
    if (this.isEditMode && shippingData._id) {
      this.shippingAddressService.updateShippingAddress(shippingData).subscribe({
        next: () => {
          this.closeForm();
        },
        error: (error) => {
          console.error('Error al actualizar dirección:', error);
        }
      });
    } else {
      const { _id, ...createData } = shippingData;
      this.shippingAddressService.createShippingAddress(createData).subscribe({
        next: () => {
          this.closeForm();
        },
        error: (error) => {
          console.error('Error al crear dirección:', error);
        }
      });
    }
  }

  onDelete(addressId: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
      this.shippingAddressService.deleteShippingAddress(addressId).subscribe({
        next: () => {
        },
        error: (error) => {
          console.error('Error al eliminar dirección:', error);
        }
      });
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedAddress = null;
    this.isEditMode = false;
  }

  onSetDefault(shippingId: string): void {
    this.shippingAddressService.setDefaultShippingAddress(shippingId).subscribe({
      next: () => {
      },
      error: (error) => {
        console.error('Error al establecer dirección por defecto:', error);
      }
    });
  }
}