import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SignupData} from '../../../auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from '../account.service';
import {UserData} from '../../../shared/models/user-data.model';
import {DataManagerService} from '../../../shared/services/data-manager.service';
import {Subscription} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';


@Component({
  selector: 'sc-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.scss']
})
export class AccountEditComponent implements OnInit, OnDestroy {

  form: FormGroup<{
    name: FormControl<string>,
    lastName: FormControl<string>,
    image: FormControl<string>
  }>;

  errorMessage: string;

  user: UserData & { userId: string };

  private subscription: Subscription;

  constructor(
      private accountService: AccountService,
      private dataManager: DataManagerService,
      private router: Router,
      private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.subscription = this.accountService.user$.subscribe(user => {
      this.user = user;
      this.initForm();
    });
  }

  onReset() {
    this.initForm();
    this.errorMessage = null;
  }

  onCancel() {
    this.router.navigate(['../../info'], {relativeTo: this.route, state: {bypass: true}});
  }

  onSubmit() {
    if (this.form.valid) {
      this.errorMessage = null;
      this.dataManager.putUserData(this.user.userId, {
        ...this.user, ...this.form.value,
        userId: null
      } as UserData).subscribe({
        next: () => {
          this.router.navigate(['../../info'], {relativeTo: this.route, state: {bypass: true}});
        }, error: (err: HttpErrorResponse) => {
          this.errorMessage = err.message;
        }
      })
    }
  }

  private initForm(): void {
    const newForm = new FormGroup({
      name: new FormControl<string>(this.user.name, [Validators.required, Validators.minLength(3)]),
      lastName: new FormControl<string>(this.user.lastName, [Validators.required, Validators.minLength(3)]),
      image: new FormControl<string>(this.user.image != null ? this.user.image : 'assets/images/customer-default.png')
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
    this.subscription.unsubscribe();
  }

}
