import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';


@Component({
  selector: 'sc-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  form: FormGroup<{
    email: FormControl<string>,
    password: FormControl<string>,
    name: FormControl<string>,
    lastName: FormControl<string>,
    type: FormControl<'company' | 'customer'>
  }>;

  type: 'company' | 'customer' = 'customer';

  minLength: number;

  maxLength: number;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.minLength = this.authService.minLength;
    this.maxLength = this.authService.maxLength;
    this.initForm();
    this.form.controls.type.valueChanges.subscribe(type => {
      this.type = type;
    })
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
      email: new FormControl<string>(null, [Validators.required, Validators.email]),
      password: new FormControl<string>(null, [Validators.required, Validators.minLength(this.minLength)]),
      name: new FormControl<string>(null, [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl<string>(null, [Validators.minLength(3)]),
      type: new FormControl<'company' | 'customer'>('customer', [Validators.required])
    })
  }
}
