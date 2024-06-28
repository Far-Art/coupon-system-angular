import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCouponModalComponent } from './create-coupon-modal.component';

describe('CreateCouponModalComponent', () => {
  let component: CreateCouponModalComponent;
  let fixture: ComponentFixture<CreateCouponModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCouponModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCouponModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
