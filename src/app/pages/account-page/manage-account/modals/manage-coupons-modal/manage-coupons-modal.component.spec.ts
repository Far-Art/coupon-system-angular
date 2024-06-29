import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ManageCouponsModalComponent} from './manage-coupons-modal.component';


describe('ManageCouponsModalComponent', () => {
  let component: ManageCouponsModalComponent;
  let fixture: ComponentFixture<ManageCouponsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageCouponsModalComponent]
    })
                 .compileComponents();

    fixture   = TestBed.createComponent(ManageCouponsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
