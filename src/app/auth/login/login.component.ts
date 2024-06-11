import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService, LoginData, LoginForm} from '../auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';


@Component({
  selector: 'sc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  form: FormGroup<LoginForm>;

  errorMessage: string;

  minLength: number;

  maxLength: number;

  private subscription: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.minLength = this.authService.passwordMinLength;
    this.maxLength = this.authService.passwordMaxLength;

    this.initForm();
    if (this.authService.loginFormData) {
      this.form.setValue(this.authService.loginFormData);
    } else {
      this.authService.loginFormData = this.form.value as LoginData;
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.errorMessage = null;
      this.subscription = this.authService.login(this.form.value as LoginData).subscribe({
        next: () => {
          this.router.navigate(['/']);
        }, error: (error: Error) => {
          this.errorMessage = error.message;
        }
      });
    }
  }

  onReset() {
    this.initForm();
    this.errorMessage              = null;
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

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

}
