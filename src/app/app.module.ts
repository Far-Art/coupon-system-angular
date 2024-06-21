import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {SharedModule} from './shared/shared.module';
import {CouponsModule} from './features/coupons/coupons.module';
import {FooterComponent} from './footer/footer/footer.component';
import {HeaderModule} from './header/header.module';
import {CoreModule} from './core/core.module';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EmptyPageComponent} from './pages/empty-page/empty-page.component';
import {ManageAccountComponent} from './pages/account-page/manage-account/manage-account.component';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    EmptyPageComponent,
    ManageAccountComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    HeaderModule,
    CouponsModule
  ],
  providers: [],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
