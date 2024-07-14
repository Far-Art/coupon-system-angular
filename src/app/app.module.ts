import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {SharedModule} from './shared/shared.module';
import {CouponsModule} from './features/coupons/coupons.module';
import {CoreModule} from './core/core.module';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EmptyPageComponent} from './pages/empty-page/empty-page.component';
import {ThemeService} from './shared/services/theme.service';


@NgModule({
  declarations: [
    AppComponent,
    EmptyPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    CouponsModule
  ],
  providers: [ThemeService],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
