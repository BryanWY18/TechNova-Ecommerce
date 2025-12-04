import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentFormComponent } from "../../../components/payment/payment-form/payment-form.component";
import { PaymentMethodsService } from '../../../core/services/paymentMethods/payment-methods.service';
import { PaymentMethod } from '../../../core/types/PaymentMethod';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-paymethods',
  standalone: true,
  imports: [CommonModule, PaymentFormComponent],
  templateUrl: './paymethods.component.html',
  styleUrl: './paymethods.component.css'
})
export class PaymethodsComponent implements OnInit {
  
  paymentMethods$!: Observable<PaymentMethod[]>;
  selectedPayment: PaymentMethod | null = null;
  isEditMode: boolean = false;
  showForm: boolean = false;

  constructor(private paymentService: PaymentMethodsService) {}

  ngOnInit(): void {
    this.loadPaymentMethods();
  }

  loadPaymentMethods(): void {
    const userId = this.paymentService.getUserId();
    this.paymentMethods$ = this.paymentService.getPaymentMethodsByUser(userId);
  }
  
  onAddNew(): void {
    this.selectedPayment = null;
    this.isEditMode = false;
    this.showForm = true;
  }

  onEdit(payment: PaymentMethod): void {
    this.selectedPayment = payment;
    this.isEditMode = true;
    this.showForm = true;
  }

  onPaymentSaved(paymentData: PaymentMethod): void {
    if (this.isEditMode && paymentData._id) {
      // Actualizar método de pago existente
      this.paymentService.updatePaymentMethod(paymentData).subscribe({
        next: () => {
          this.loadPaymentMethods();
          this.closeForm();
        },
        error: (error) => {
          console.error('Error al actualizar método de pago:', error);
        }
      });
    } else {
      // Crear nuevo método de pago
      const { _id, ...createData } = paymentData;
      this.paymentService.createPaymentMethod(createData).subscribe({
        next: () => {
          this.loadPaymentMethods();
          this.closeForm();
        },
        error: (error) => {
          console.error('Error al crear método de pago:', error);
        }
      });
    }
  }

  onDelete(paymentId: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este método de pago?')) {
       this.paymentService.deletePaymentMethod(paymentId).subscribe({
         next: () => {
           this.loadPaymentMethods();
         },
         error: (error) => {
           console.error('Error al eliminar método de pago:', error);
         }
       });
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.selectedPayment = null;
    this.isEditMode = false;
  }

  getPaymentTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'credit-card': 'Tarjeta de Crédito',
      'debit-card': 'Tarjeta de Débito',
      'paypal': 'PayPal',
      'bank-transfer': 'Transferencia Bancaria',
      'cash': 'Efectivo'
    };
    return labels[type] || type;
  }

  onSetDefault(paymentId:string): void{
    this.paymentService.defaultPaymentMethod(paymentId).subscribe({
      next:()=>{
        this.loadPaymentMethods();
      }
    });
  };
  
}