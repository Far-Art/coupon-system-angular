import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractFormInputComponent } from './abstract-form-input.component';

describe('AbstractFormInputComponent', () => {
  let component: AbstractFormInputComponent;
  let fixture: ComponentFixture<AbstractFormInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbstractFormInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbstractFormInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
