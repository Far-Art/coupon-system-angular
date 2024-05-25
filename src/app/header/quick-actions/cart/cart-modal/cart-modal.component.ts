import {Component, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Coupon} from "../../../../shared/models/coupon.model";

@Component({
  selector: 'sc-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss']
})
export class CartModalComponent {

  cartList: Coupon[] = [];

  @ViewChild('cartContent') private cartContent!: TemplateRef<any>;

  constructor(private modalService: NgbModal) {}

  openModal() {
    this.modalService.open(this.cartContent, {scrollable: true});
  }
}
