import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {IdGeneratorService} from '../../../../../shared/services/id-generator.service';
import {AuthService} from '../../../../../auth/auth.service';
import {Subscription} from 'rxjs';
import {UserData} from '../../../../../shared/models/user-data.model';
import {CouponsService} from '../../../../../features/coupons/coupons.service';


@Component({
  selector: 'cs-create-coupon-modal',
  templateUrl: './create-coupon-modal.component.html',
  styleUrls: ['./create-coupon-modal.component.scss']
})
export class CreateCouponModalComponent implements OnInit, OnDestroy {

  form: FormGroup<{
    id: FormControl<string>;
    companyId: FormControl<string>;
    companyName: FormControl<string>;
    companyEmail: FormControl<string>;
    category: FormControl<string>;
    title: FormControl<string>;
    description: FormControl<string>;
    amount: FormControl<number>;
    price: FormControl<number>;
    startDate: FormControl<Date>;
    endDate: FormControl<Date>;
    image: FormControl<string>;
    isSaleEnded: FormControl<boolean>;
  }>;

  private subscription: Subscription;

  private user: UserData;

  constructor(private idGenerator: IdGeneratorService, private authService: AuthService) {}

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe(user => {
      this.user = user as UserData;
      this.form = this.initForm();
    })
  }

  private initForm() {
    return new FormGroup({
      id: new FormControl<string>(this.idGenerator.generate()),
      companyId: new FormControl<string>(this.user.authData.localId),
      companyName: new FormControl<string>(this.user.name),
      companyEmail: new FormControl<string>(this.user.email),
      category: new FormControl<string>(null, [Validators.required]),
      title: new FormControl<string>(null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
      description: new FormControl<string>(null, [Validators.required, Validators.minLength(2), Validators.maxLength(350)]),
      amount: new FormControl<number>(null, [Validators.required, Validators.min(1)]),
      price: new FormControl<number>(null, [Validators.required, Validators.min(0)]),
      startDate: new FormControl<Date>(new Date(), [Validators.required]),
      endDate: new FormControl<Date>(new Date(new Date().setDate(new Date().getDate() + 1)), [Validators.required]),
      image: new FormControl<string>(CouponsService.defaultCouponImage),
      isSaleEnded: new FormControl<boolean>(false)
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
