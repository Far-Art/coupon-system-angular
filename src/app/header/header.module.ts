import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QuickActionsComponent} from './quick-actions/quick-actions.component';
import {CartModalComponent} from './quick-actions/cart/cart-modal.component';
import {FilterModalComponent} from './quick-actions/filter/filter-modal.component';
import {WishListModalComponent} from './quick-actions/wish-list/wish-list-modal.component';
import {OffCanvasComponent} from './offcanvas/off-canvas.component';
import {SharedModule} from '../shared/shared.module';
import {CoreModule} from '../core.module';
import {AuthModule} from '../auth/auth.module';


@NgModule({
  declarations: [
    QuickActionsComponent,
    CartModalComponent,
    FilterModalComponent,
    WishListModalComponent,
    OffCanvasComponent
  ],
  exports: [
    QuickActionsComponent,
    OffCanvasComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    AuthModule,
    SharedModule
  ]
})
export class HeaderModule {}
