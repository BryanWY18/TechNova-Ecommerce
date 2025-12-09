import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order/order.service';
import { Observable } from 'rxjs';
import { Order } from '../../../core/types/Order';
import { OrderSkeletonComponent } from "../../../components/shared/skeleton/order-skeleton/order-skeleton.component";

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, RouterLink, OrderSkeletonComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {

  orderData$!: Observable<Order[]>;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(){
    this.getOrders();
  }

  readonly internalSkeletonArray = Array(5).fill(0);

  get skeletonArray(): number[] {
    return this.internalSkeletonArray;
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
