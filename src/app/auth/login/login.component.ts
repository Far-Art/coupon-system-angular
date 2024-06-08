import {Component, OnInit} from '@angular/core';
import {AuthService, LoginData, LoginForm} from '../auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'sc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup<LoginForm>;

  minLength: number;

  maxLength: number;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.minLength = this.authService.minLength;
    this.maxLength = this.authService.maxLength;

    this.initForm();
    if (this.authService.loginFormData) {
      this.form.setValue(this.authService.loginFormData);
    } else {
      this.authService.loginFormData = this.form.value as LoginData;
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.login({...this.form.value as LoginData});
      this.initForm();
    }
  }

  onReset() {
    this.initForm();
    this.authService.loginFormData = this.form.value as LoginData;
  }

  private initForm(): void {
    const newForm = new FormGroup({
      email: new FormControl<string>(null, [Validators.required, Validators.email]),
      password: new FormControl<string>(null, [Validators.required, Validators.minLength(this.minLength)])
    });

    if (this.form) {
      this.form.setValue(newForm.value as LoginData);
      this.form.markAsUntouched();
      this.form.markAsPristine();
    } else {
      this.form = newForm;
    }
  }

}
