import {Component, HostBinding, Input} from '@angular/core';
import {arrowAnimation, contentAnimation, textAnimation} from './accordion.animation';
import {AccordionComponent} from '../accordion.component';


@Component({
  selector: 'cs-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss'],
  animations: [arrowAnimation(150), textAnimation(200), contentAnimation(250)]
})
export class AccordionItemComponent {

  index: number;
  isShown: boolean           = false;
  disableAnimations: boolean = false;
  @HostBinding('style') style: string;

  @Input() text: string;

  @Input() disabled = false;

  constructor(private parent: AccordionComponent) {}

  click() {
    if (this.isShown) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isShown = true;
    this.parent.onItemClick(this.index);
  }

  close() {
    this.isShown = false;
  }

}
