import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmptyPageComponent} from './pages/empty-page/empty-page.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home-page/home-page.module').then(m => m.HomePageModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account-page/account-page.module').then(m => m.AccountPageModule)
  },
  {
    path: 'docs',
    loadChildren: () => import('./pages/documentation-page/documentation.module').then(m => m.DocumentationModule)
  },
  {
    path: 'comment',
    loadChildren: () => import('./pages/comment-page/comment-page.module').then(m => m.CommentPageModule)
  },
  {
    path: '**',
    component: EmptyPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
