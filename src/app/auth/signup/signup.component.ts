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
    let lastName   = this.authService.signupForm?.value?.params?.lastName;

    // TODO resolve last name lost on init or type change
    if (this.authService.signupForm) {
      this.form = this.authService.signupForm;
      this.form.controls.lastName.setValue(lastName);
      this.type = this.form.controls.type.value;
    } else {
      this.initForm();
      this.authService.signupForm = this.form;
    }

    this.form.controls.type.valueChanges.subscribe(type => {
      this.type = type;
      if (type === 'company') {
        lastName = this.authService.signupForm?.value?.params?.lastName;
        this.form.controls.lastName.removeValidators(Validators.required);
        this.form.controls.lastName.setValue(null);
      } else {
        this.form.controls.lastName.addValidators(Validators.required);
        this.form.controls.lastName.setValue(lastName);
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
    // TODO on reset while on company type, last name field dissapears
    // TODO after resetting form cannot select user type
    this.initForm();
    this.authService.signupForm = this.form;
  }

  private initForm(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(this.minLength)]),
      name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      type: new FormControl<UserType>('customer', [Validators.required])
    })
  }

  ngOnDestroy(): void {
    this.authService.signupForm = this.form;
  }
}
