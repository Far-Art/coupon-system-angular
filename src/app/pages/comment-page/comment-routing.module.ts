import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommentPageComponent} from './comment-page.component';


const routes: Routes = [
  {
    path: '',
    component: CommentPageComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommentRoutingModule {}
