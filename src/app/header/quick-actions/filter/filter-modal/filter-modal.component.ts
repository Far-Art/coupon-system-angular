import {Component, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'sc-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent {

  @ViewChild('filterContent') private filterContent!: TemplateRef<any>;

  filterList: string[] = [];

  constructor(private modalService: NgbModal) {}

  openModal() {
    this.modalService.open(this.filterContent, {scrollable: true});
  }

}
