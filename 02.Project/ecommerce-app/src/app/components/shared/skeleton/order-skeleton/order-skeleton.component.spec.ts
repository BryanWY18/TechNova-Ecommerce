import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSkeletonComponent } from './order-skeleton.component';

describe('OrderSkeletonComponent', () => {
  let component: OrderSkeletonComponent;
  let fixture: ComponentFixture<OrderSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
