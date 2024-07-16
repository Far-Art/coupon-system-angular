import {AfterViewInit, Component, ContentChildren, QueryList} from '@angular/core';
import {AccordionItemComponent} from './accordion-item/accordion-item.component';


@Component({
  selector: 'cs-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements AfterViewInit {

  @ContentChildren(AccordionItemComponent) items: QueryList<AccordionItemComponent>;

  constructor() {}

  onItemClick(index: number) {
    this.items.filter(item => item.index !== index).forEach(item => item.close());
  }

  ngAfterViewInit(): void {
    this.items.forEach((item, i) => item.index = i);
  }

}
