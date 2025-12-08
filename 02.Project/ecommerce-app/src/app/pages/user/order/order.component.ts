import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order/order.service';
import { Observable } from 'rxjs';
import { Order } from '../../../core/types/Order';

@Component({
  selector: 'app-order',
  imports: [CommonModule, RouterLink],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {

  orderData$!: Observable<Order[]>;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(){
    this.getOrders();
  }

  getOrders() {
    const userId = this.orderService.getUserId();
    this.orderData$ = this.orderService.getOrdersByUserId(userId);
  }

  /**
  cancelOrder(orderId: string) {
    if (confirm('¿Estás seguro de que quieres cancelar esta orden?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          this.getOrders();
        }
      });
    }
  }
  */

}
