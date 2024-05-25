import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishListModalComponent } from './wish-list-modal.component';

describe('WishListModalComponent', () => {
  let component: WishListModalComponent;
  let fixture: ComponentFixture<WishListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishListModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
