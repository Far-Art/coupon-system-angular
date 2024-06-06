import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponTableComponent } from './coupon-table.component';

describe('CouponTableComponent', () => {
  let component: CouponTableComponent;
  let fixture: ComponentFixture<CouponTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouponTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouponTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
