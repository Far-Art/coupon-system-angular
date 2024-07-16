import {Component, Input} from '@angular/core';
import {textAnimation, arrowAnimation, contentAnimation} from './accordion.animation';
import {AccordionComponent} from '../accordion.component';


@Component({
  selector: 'cs-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss'],
  animations: [arrowAnimation(200), textAnimation(200), contentAnimation(200)]
})
export class AccordionItemComponent {

  index: number;
  isShown: boolean           = false;
  disableAnimations: boolean = false;

  @Input() text: string;

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
