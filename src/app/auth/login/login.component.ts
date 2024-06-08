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

    if (this.authService.loginForm) {
      this.form = this.authService.loginForm;
    } else {
      this.initForm();
      this.authService.loginForm = this.form;
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
    this.authService.loginForm = this.form;
  }

  private initForm(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(this.minLength)])
    })
  }

}
