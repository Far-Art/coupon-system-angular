import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {MainPageComponent} from './main-page/main-page.component';
import {SharedModule} from './shared/shared.module';
import {CouponsModule} from './features/coupons/coupons.module';
import {FooterComponent} from './footer/footer/footer.component';
import {HeaderModule} from './header/header.module';
import {CoreModule} from './core.module';
import {AuthModule} from './auth/auth.module';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainPageComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    HeaderModule,
    CouponsModule,
    AppRoutingModule,
    AuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
