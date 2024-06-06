import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'sc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup<{ email: FormControl<string>, password: FormControl<string> }>;

  minLength: number;

  maxLength: number;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.minLength = this.authService.minLength;
    this.maxLength = this.authService.maxLength;
    this.initForm();
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.login({
        email: this.form.value.email,
        password: this.form.value.password
      });
    }
  }

  private initForm(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(this.minLength)])
    })
  }

}
