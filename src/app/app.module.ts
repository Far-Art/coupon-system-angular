import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {MainPageComponent} from './main-page/main-page.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgOptimizedImage} from "@angular/common";
import {QuickActionsComponent} from './header/quick-actions/quick-actions.component';
import {FilterComponent} from './header/quick-actions/filter/filter.component';
import {CartComponent} from './header/quick-actions/cart/cart.component';
import {WishListComponent} from './header/quick-actions/wish-list/wish-list.component';
import {SharedModule} from "./shared/shared.module";
import {CouponsModule} from "./features/coupons/coupons.module";
import {CartModalComponent} from './header/quick-actions/cart/cart-modal/cart-modal.component';
import {FilterModalComponent} from './header/quick-actions/filter/filter-modal/filter-modal.component';
import {WishListModalComponent} from './header/quick-actions/wish-list/wish-list-modal/wish-list-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainPageComponent,
    QuickActionsComponent,
    FilterComponent,
    CartComponent,
    WishListComponent,
    CartModalComponent,
    FilterModalComponent,
    WishListModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgOptimizedImage,
    CouponsModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
