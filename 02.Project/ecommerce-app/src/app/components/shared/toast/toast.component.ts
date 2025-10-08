import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastService } from '../../../core/services/toast/toast.service';
import { Observable, of, Subscription } from 'rxjs';
import { ToastMessage } from '../../../core/types/ToastMessage';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [AsyncPipe],
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent implements OnInit, OnDestroy {
  toast$: Observable<ToastMessage[]> = of([]);
  toastsHistory$: Observable<ToastMessage[]> = of([]);
  suscription!: Subscription

  constructor(private toastService: ToastService) {}
  ngOnInit(): void {
    this.toast$ = this.toastService.toast$;
    this.suscription = this.toast$.subscribe();
  }
  
  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
