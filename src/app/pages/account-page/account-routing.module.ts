import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountPageComponent} from './account-page.component';
import {accountGuard} from './account.guard';
import {AccountInfoComponent} from './account-info/account-info.component';
import {PurchasedComponent} from './purchased/purchased.component';
import {AccountEditComponent} from './account-edit/account-edit.component';


const routes: Routes = [
  {
    path: '', canActivate: [accountGuard], component: AccountPageComponent, children: [
      {path: 'info', component: AccountInfoComponent},
      {path: 'purchased', component: PurchasedComponent},
      {path: 'edit', component: AccountEditComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
