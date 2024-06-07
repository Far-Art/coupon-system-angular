import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from './main-page/main-page.component';
import {EmptyPageComponent} from './empty-page/empty-page.component';
import {AuthComponent} from './auth/auth.component';


const routes: Routes = [
  {path: '', component: MainPageComponent, pathMatch: 'full'},
  {path: 'auth', component: AuthComponent},
  {path: '**', component: EmptyPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
