import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService, SignupData, SignupForm, UserType} from '../auth.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';


@Component({
  selector: 'sc-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  form: FormGroup<SignupForm>;

  errorMessage: string;

  type: UserType = 'customer';

  minLength: number;

  maxLength: number;

  isLoading = false;

  private subscription: Subscription;

  private defaultCustomerImgPath = './assets/images/customer-default.png';
  private defaultCompanyImgPath  = './assets/images/company-default.png';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.minLength = this.authService.passwordMinLength;
    this.maxLength = this.authService.passwordMaxLength;

    this.initForm();
    if (this.authService.signupFormData) {
      this.form.setValue(this.authService.signupFormData);
      this.type = this.form.controls.type.value;
    } else {
      this.authService.signupFormData = this.form.value as SignupData;
    }

    this.form.controls.type.valueChanges.subscribe(type => {
      this.type = type;
      const img = this.form.controls.image.value;
      if (type === 'company') {
        this.authService.signupFormData = this.form.value as SignupData;
        this.form.controls.lastName.removeValidators(Validators.required);
        this.form.controls.lastName.setValue(null);

        if (img == null || img.localeCompare(this.defaultCustomerImgPath) === 0) {
          this.form.controls.image.setValue(this.defaultCompanyImgPath);
        }
      } else {
        this.form.controls.lastName.addValidators(Validators.required);
        this.form.controls.lastName.setValue(this.authService.signupFormData.lastName);

        if (img == null || img.localeCompare(this.defaultCompanyImgPath) === 0) {
          this.form.controls.image.setValue(this.defaultCustomerImgPath);
        }
      }
    })
  }

  onSubmit() {
    if (this.form.valid) {
      this.errorMessage = null;
      this.isLoading    = true;
      this.subscription = this.authService.signUp({...this.form.value} as SignupData)
          .subscribe({
            next: () => {
              this.isLoading = false;
              this.router.navigate(['/']);
            }, error: (error: Error) => {
              this.errorMessage = error.message;
              this.isLoading    = false;
            }
          });
    }
  }

  onReset() {
    this.initForm();
    this.errorMessage               = null;
    this.authService.signupFormData = this.form.value as SignupData;
  }

  private initForm(): void {
    const newForm = new FormGroup({
      email: new FormControl<string>(null, [Validators.required, Validators.email]),
      password: new FormControl<string>(null, [Validators.required, Validators.minLength(this.minLength)]),
      name: new FormControl<string>(null, [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl<string>(null, [Validators.required, Validators.minLength(3)]),
      type: new FormControl<UserType>('customer', [Validators.required]),
      image: new FormControl<string>(this.defaultCustomerImgPath)
    })

    if (this.form) {
      this.form.setValue(newForm.value as SignupData);
      this.form.markAsUntouched();
      this.form.markAsPristine();
    } else {
      this.form = newForm;
    }
  }

  ngOnDestroy(): void {
    this.authService.signupFormData = this.form.value as SignupData;
    if (this.subscription) this.subscription.unsubscribe()
  }
}
