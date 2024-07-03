import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {IdGeneratorService} from '../../../../../shared/services/id-generator.service';
import {AuthService} from '../../../../../auth/auth.service';
import {Subscription} from 'rxjs';
import {UserData} from '../../../../../shared/models/user-data.model';
import {CouponsService} from '../../../../../features/coupons/coupons.service';
import {FormErrorParams} from '../../../../../shared/components/inputs/abstract-form-input.component';


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

  constructor(
      private idGenerator: IdGeneratorService,
      private authService: AuthService,
      private couponsService: CouponsService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.user$.subscribe(user => {
      this.user = user as UserData;
      this.form = this.initForm();
    })
  }

  onSubmit() {
    if (this.form.valid) {
      this.couponsService.addCoupon(this.form.value as any);
      this.form.setValue(this.initForm().value as any);
      this.form.markAsUntouched();
      this.form.markAsPristine();
    }
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
      startDate: new FormControl<string>(this.formatDate(new Date()), [Validators.required, this.dateValidator(null)]),
      endDate: new FormControl<string>(this.formatDate(new Date(new Date().setDate(new Date().getDate() + 1))), [Validators.required, this.dateValidator(null)]),
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
        const validatedSd = this.dateValidator('Start date')(this.form.controls.endDate);
        return {
          evaluate: () => validatedSd != null,
          message: validatedSd != null ? validatedSd?.['error'] : null
        }
      case 'endDate':
        const validatedEn = this.dateValidator('End date')(this.form.controls.endDate);
        return {
          evaluate: () => validatedEn != null,
          message: validatedEn != null ? validatedEn?.['error'] : null
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

  private dateValidator(controlName: string, minDate?: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == null) {
        return {'error': `${controlName} must be provided`};
      }
      const min   = minDate ? new Date(minDate.setHours(0, 0, 0, 0)) : new Date(new Date().setHours(0, 0, 0, 0));
      const value = new Date(control.value);

      if (value < min) {
        return {'error': `${controlName} cannot be less than ${minDate.getDate()}/${minDate.getMonth() + 1}/${minDate.getFullYear()}`};
      }
      return null;
    }

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
