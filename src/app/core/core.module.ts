import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HeaderComponent} from './header/header.component';
import {LogoComponent} from './header/logo/logo.component';
import {MainHeaderContentComponent} from './header/main-header-content/main-header-content.component';
import {FooterComponent} from './footer/footer/footer.component';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {DeviceService} from './services/device.service';


@NgModule({
  declarations: [
    HeaderComponent,
    LogoComponent,
    MainHeaderContentComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    HeaderComponent,
    MainHeaderContentComponent,
    FooterComponent
  ],
  providers: [
    DeviceService
  ]
})
export class CoreModule {
}
