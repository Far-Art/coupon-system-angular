import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmNavigationComponent } from './confirm-navigation.component';

describe('ConfirmNavigationComponent', () => {
  let component: ConfirmNavigationComponent;
  let fixture: ComponentFixture<ConfirmNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmNavigationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
