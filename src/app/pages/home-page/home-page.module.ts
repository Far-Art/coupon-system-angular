import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QuickActionsComponent} from './quick-actions/quick-actions.component';
import {HomePageComponent} from './home-page.component';
import {CoreModule} from '../../core/core.module';
import {SharedModule} from '../../shared/shared.module';
import {HomePageRoutingModule} from './home-page-routing.module';
import {CartService} from './quick-actions/modals/cart-modal/cart.service';
import {WishListModalComponent} from './quick-actions/modals/wish-list-modal/wish-list-modal.component';
import {FilterModalComponent} from './quick-actions/modals/filter-modal/filter-modal.component';
import {CartModalComponent} from './quick-actions/modals/cart-modal/cart-modal.component';
import {CouponsModule} from '../../features/coupons/coupons.module';
import {HeaderModule} from '../../header/header.module';
import {FilterService} from './quick-actions/modals/filter-modal/filter.service';


@NgModule({
  declarations: [
    QuickActionsComponent,
    WishListModalComponent,
    CartModalComponent,
    FilterModalComponent,
    HomePageComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    HomePageRoutingModule,
    CouponsModule,
    HeaderModule
  ],
  exports: [],
  providers: [CartService, FilterService]
})
export class HomePageModule {}
