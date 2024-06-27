import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DocumentationPageComponent} from './documentation-page.component';


const routes: Routes = [
  {path: '', component: DocumentationPageComponent}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentationRoutingModule {}
