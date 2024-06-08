import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService, SignupData, SignupForm, UserType} from '../auth.service';


@Component({
  selector: 'sc-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  form: FormGroup<SignupForm>;

  type: UserType = 'customer';

  minLength: number;

  maxLength: number;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.minLength = this.authService.minLength;
    this.maxLength = this.authService.maxLength;

    this.initForm();
    if (this.authService.signupFormData) {
      this.form.setValue(this.authService.signupFormData);
      this.type = this.form.controls.type.value;
    } else {
      this.authService.signupFormData = this.form.value as SignupData;
    }

    this.form.controls.type.valueChanges.subscribe(type => {
      this.type = type;
      if (type === 'company') {
        this.authService.signupFormData = this.form.value as SignupData;
        this.form.controls.lastName.removeValidators(Validators.required);
        this.form.controls.lastName.setValue(null);
      } else {
        this.form.controls.lastName.addValidators(Validators.required);
        this.form.controls.lastName.setValue(this.authService.signupFormData.lastName);
      }
    })
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.signUp({...this.form.value} as SignupData);
      this.initForm();
    }
  }

  onReset() {
    this.initForm();
    this.authService.signupFormData = this.form.value as SignupData;
  }

  private initForm(): void {
    const newForm = new FormGroup({
      email: new FormControl<string>(null, [Validators.required, Validators.email]),
      password: new FormControl<string>(null, [Validators.required, Validators.minLength(this.minLength)]),
      name: new FormControl<string>(null, [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl<string>(null, [Validators.required, Validators.minLength(3)]),
      type: new FormControl<UserType>('customer', [Validators.required])
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
  }
}
