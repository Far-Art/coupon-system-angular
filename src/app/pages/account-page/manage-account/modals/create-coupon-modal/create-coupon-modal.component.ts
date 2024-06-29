import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {IdGeneratorService} from '../../../../../shared/services/id-generator.service';
import {AuthService} from '../../../../../auth/auth.service';
import {Subscription} from 'rxjs';
import {UserData} from '../../../../../shared/models/user-data.model';
import {CouponsService} from '../../../../../features/coupons/coupons.service';
import {FormErrorParams} from '../../../../../shared/components/form-inputs/abstract-form-input.component';


@Component({
  selector: 'cs-create-coupon-modal',
  templateUrl: './create-coupon-modal.component.html',
  styleUrls: ['./create-coupon-modal.component.scss']
})
export class CreateCouponModalComponent implements OnInit, OnDestroy {

  categories = ['GROCERY', 'BABY', 'HOTELS', 'RESTAURANT', 'PERSONAL_CARE', 'HOUSEHOLD', 'ELECTRONICS', 'TOOLS', 'VACATION', 'TRAVEL', 'AUTOMOTIVE', 'FASHION', 'SOFTWARE', 'MISCELLANEOUS'];

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
    startDate: FormControl<string>;
    endDate: FormControl<string>;
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

  onSubmit() {
    console.log(this.form.value)
  }

  private initForm() {
    return new FormGroup({
      id: new FormControl<string>(this.idGenerator.generate(25)),
      companyId: new FormControl<string>(this.user.authData.localId),
      companyName: new FormControl<string>(this.user.name),
      companyEmail: new FormControl<string>(this.user.email),
      category: new FormControl<string>(null, [Validators.required]),
      title: new FormControl<string>(null, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
      description: new FormControl<string>(null, [Validators.required, Validators.minLength(2), Validators.maxLength(350)]),
      amount: new FormControl<number>(null, [Validators.required, Validators.min(1)]),
      price: new FormControl<number>(null, [Validators.required, Validators.min(0)]),
      startDate: new FormControl<string>(this.formatDate(new Date()), [Validators.required, this.minDateValidator()]),
      endDate: new FormControl<string>(this.formatDate(new Date(new Date().setDate(new Date().getDate() + 1))), [Validators.required, this.minDateValidator(new Date(new Date().setDate(new Date().getDate() + 1)))]),
      image: new FormControl<string>(CouponsService.defaultCouponImage),
      isSaleEnded: new FormControl<boolean>(false)
    })
  }

  getErrorList(controlName: string): FormErrorParams<any> | FormErrorParams<any>[] {
    switch (controlName) {
      case 'categories':
        return {
          evaluate: (value: any) => !value,
          message: 'Category should be selected'
        };

      case 'title':
        return [
          {
            evaluate: (value: string) => !value,
            message: 'Title must be provided'
          },
          {
            evaluate: (value: string) => value?.length < 2,
            message: 'Title must be at least 2 characters'
          },
          {
            evaluate: (value: string) => value?.length > 20,
            message: 'Title cannot exceed 20 characters'
          }
        ]
      case 'description':
        return [
          {
            evaluate: (value: string) => !value,
            message: 'Description must be provided'
          },
          {
            evaluate: (value: string) => value?.length < 2,
            message: 'Description must be at least 2 characters'
          },
          {
            evaluate: (value: string) => value?.length > 350,
            message: 'Description cannot exceed 350 characters'
          }
        ]
      case 'amount':
        return {
          evaluate: (value: number) => value <= 0,
          message: 'Amount must be greater than 0'
        }
      case 'price':
        return {
          evaluate: (value: number) => value < 0,
          message: 'Price cannot be negative'
        }
      case 'startDate':
        return {
          evaluate: () => this.minDateValidator()(this.form.controls.startDate) != null,
          message: this.minDateValidator()(this.form.controls.startDate) != null ? this.minDateValidator()(this.form.controls.startDate) + '' : null
        }
      case 'endDate':
        return {
          evaluate: () => this.minDateValidator()(this.form.controls.endDate) != null,
          message: this.minDateValidator(new Date(new Date().setDate(new Date().getDate() + 1)))(this.form.controls.endDate) != null ? this.minDateValidator()(this.form.controls.endDate) + '' : null
        }
      default: {
        return null;
      }
    }
  }

  private formatDate(date: Date): string {
    if (date == null) return null
    return date.toISOString().substring(0, 10);
  }

  private minDateValidator(min?: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) {
        return {'error': 'date is null'};
      }
      const minDate = min ? min.setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0);
      const value   = new Date(control.value).getTime();

      if (value < minDate) {
        return {'error': 'date is less than min'};
      }
      return null;
    }

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
