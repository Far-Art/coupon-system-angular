import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService, SignupData, SignupForm, UserType} from '../auth.service';


@Component({
  selector: 'sc-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  form: FormGroup<SignupForm>;

  type: UserType = 'customer';

  minLength: number;

  maxLength: number;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.minLength = this.authService.minLength;
    this.maxLength = this.authService.maxLength;
    let lastName   = null;

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
        lastName = this.form.controls.lastName.value;
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

  private initForm(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(this.minLength)]),
      name: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      type: new FormControl<UserType>('customer', [Validators.required])
    })
  }
}
