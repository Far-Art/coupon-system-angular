import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QuickActionsComponent} from './quick-actions/quick-actions.component';
import {CartModalComponent} from './quick-actions/cart/cart-modal.component';
import {FilterModalComponent} from './quick-actions/filter/filter-modal.component';
import {WishListModalComponent} from './quick-actions/wish-list/wish-list-modal.component';
import {SharedModule} from '../shared/shared.module';
import {CoreModule} from '../core/core.module';
import {HeaderComponent} from './header.component';
import { LogoComponent } from './logo/logo.component';


@NgModule({
  declarations: [
    QuickActionsComponent,
    CartModalComponent,
    FilterModalComponent,
    WishListModalComponent,
    HeaderComponent,
    LogoComponent
  ],
  exports: [
    HeaderComponent,
    QuickActionsComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule
  ]
})
export class HeaderModule {}
