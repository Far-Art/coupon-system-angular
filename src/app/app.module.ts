import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {MainPageComponent} from './main-page/main-page.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { CouponsListComponent } from './features/coupons/coupons-list/coupons-list.component';
import { CouponsPageComponent } from './features/coupons/coupons-page/coupons-page.component';
import { CouponCardComponent } from './features/coupons/coupons-list/coupon-card/coupon-card.component';
import {NgOptimizedImage} from "@angular/common";
import { QuickActionsComponent } from './header/quick-actions/quick-actions.component';
import { FilterComponent } from './header/quick-actions/filter/filter.component';
import { CartComponent } from './header/quick-actions/cart/cart.component';
import { WishListComponent } from './header/quick-actions/wish-list/wish-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainPageComponent,
    CouponsListComponent,
    CouponsPageComponent,
    CouponCardComponent,
    QuickActionsComponent,
    FilterComponent,
    CartComponent,
    WishListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgOptimizedImage
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
