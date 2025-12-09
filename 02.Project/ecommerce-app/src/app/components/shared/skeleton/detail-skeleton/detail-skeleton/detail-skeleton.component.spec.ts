import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSkeletonComponent } from './detail-skeleton.component';

describe('DetailSkeletonComponent', () => {
  let component: DetailSkeletonComponent;
  let fixture: ComponentFixture<DetailSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
