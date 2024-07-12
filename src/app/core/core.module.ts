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
import {ToastComponent} from './toasts/toast.component';
import {ToastContainerComponent} from './toasts/toast-container/toast-container.component';
import {ToastService} from './toasts/toast.service';
import {DeviceService} from './services/device.service';


@NgModule({
  declarations: [
    HeaderComponent,
    LogoComponent,
    MainHeaderContentComponent,
    FooterComponent,
    ToastComponent,
    ToastContainerComponent
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
    FooterComponent,
    ToastContainerComponent
  ],
  providers: [
    DeviceService,
    ToastService
  ]
})
export class CoreModule {
}
