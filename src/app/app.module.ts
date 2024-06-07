import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {MainPageComponent} from './main-page/main-page.component';
import {SharedModule} from './shared/shared.module';
import {CouponsModule} from './features/coupons/coupons.module';
import {FooterComponent} from './footer/footer/footer.component';
import {HeaderModule} from './header/header.module';
import {CoreModule} from './core/core.module';
import {AuthModule} from './auth/auth.module';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EmptyPageComponent} from './empty-page/empty-page.component';


@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    FooterComponent,
    EmptyPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    HeaderModule,
    CouponsModule,
    AuthModule
  ],
  providers: [],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
