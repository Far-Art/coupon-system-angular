import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersManageModalComponent } from './users-manage-modal.component';

describe('UsersManageModalComponent', () => {
  let component: UsersManageModalComponent;
  let fixture: ComponentFixture<UsersManageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersManageModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersManageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
