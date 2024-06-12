import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountPageComponent} from './account-page.component';
import {accountGuard} from './account.guard';


const routes: Routes = [
  {
    path: '', canActivate: [accountGuard], component: AccountPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
