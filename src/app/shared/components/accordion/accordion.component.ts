import {AfterContentInit, Component, ContentChildren, Input, QueryList} from '@angular/core';
import {AccordionItemComponent} from './accordion-item/accordion-item.component';


@Component({
  selector: 'cs-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements AfterContentInit {

  @ContentChildren(AccordionItemComponent) items: QueryList<AccordionItemComponent>;

  @Input() disabled = false;

  constructor() {}

  onItemClick(index: number) {
    this.items.filter(item => item.index !== index).forEach(item => item.close());
  }

  ngAfterContentInit(): void {
    const topRadius    = 'border-top-left-radius: var(--accordion-border-radius); border-top-right-radius: var(--accordion-border-radius);';
    const bottomRadius = 'border-bottom-left-radius: var(--accordion-border-radius); border-bottom-right-radius: var(--accordion-border-radius);';
    this.items.forEach((item, i) => item.index = i);
    this.items.first.style = this.items.first.style ? this.items.first.style + topRadius : topRadius;
    this.items.last.style  = this.items.last.style ? this.items.last.style + bottomRadius : bottomRadius;
    this.items.last.style += 'border-bottom-width: var(--accordion-border-width);';
  }

}
