import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {MainPageComponent} from './main-page/main-page.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {QuickActionsComponent} from './header/quick-actions/quick-actions.component';
import {SharedModule} from './shared/shared.module';
import {CouponsModule} from './features/coupons/coupons.module';
import {CartModalComponent} from './header/quick-actions/cart/cart-modal.component';
import {FilterModalComponent} from './header/quick-actions/filter/filter-modal.component';
import {WishListModalComponent} from './header/quick-actions/wish-list/wish-list-modal.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CouponTableComponent} from './header/quick-actions/shared/coupon-table/coupon-table.component';
import {CouponItemComponent} from './header/quick-actions/shared/coupon-table/coupon-item/coupon-item.component';
import { FooterComponent } from './footer/footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainPageComponent,
    QuickActionsComponent,
    CartModalComponent,
    FilterModalComponent,
    WishListModalComponent,
    CouponTableComponent,
    CouponItemComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CouponsModule,
    SharedModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
