import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {CoreModule} from '../core/core.module';
import {HeaderComponent} from './header.component';
import {LogoComponent} from './logo/logo.component';
import {MainHeaderContentComponent} from './main-header-content/main-header-content.component';


@NgModule({
  declarations: [
    HeaderComponent,
    LogoComponent,
    MainHeaderContentComponent
  ],
  exports: [
    HeaderComponent,
    MainHeaderContentComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule
  ]
})
export class HeaderModule {}
