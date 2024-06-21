import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainHeaderContentComponent } from './main-header-content.component';

describe('MainHeaderContentComponent', () => {
  let component: MainHeaderContentComponent;
  let fixture: ComponentFixture<MainHeaderContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainHeaderContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainHeaderContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
