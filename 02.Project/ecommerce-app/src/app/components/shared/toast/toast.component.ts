import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { ToastService } from '../../../core/services/toast/toast.service';
import { Observable, of, scan, Subscription, takeUntil } from 'rxjs';
import { ToastMessage } from '../../../core/types/ToastMessage';
import { AsyncPipe, CommonModule, NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-toast',
  imports: [AsyncPipe, NgClass],
  // imports: [CommonModule],
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent implements OnInit, OnDestroy {
  toast$: Observable<ToastMessage[]> = of([]);
  toastsHistory$: Observable<ToastMessage[]> = of([]);
  suscription!: Subscription

  destroyRef= inject(DestroyRef)
  
  constructor(private toastService: ToastService) {}
  ngOnInit(): void {
    this.toast$ = this.toastService.toast$;
    this.suscription = this.toast$.subscribe();
    // this.toast$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe()
    /// 1,2,53,8,6,7,8
    // [1,2]
    this.toastsHistory$ = this.toastService.toastHistory$.pipe(
     scan((acc: ToastMessage[], current: ToastMessage)=>{
      const update = [...acc, current]
      return update.slice(-10)
     }, []) 
    )
    
  }
  
  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
}
