import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from './auth.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';


const authRoutes: Routes = [
  {
    path: '', children: [
      {path: 'login', component: LoginComponent},
      {path: 'signup', component: SignupComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
