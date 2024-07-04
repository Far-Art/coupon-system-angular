import {Component, OnInit} from '@angular/core';
import {ModalService} from '../modal.service';

@Component({
  selector: 'cs-modals-container',
  templateUrl: './modals-container.component.html',
  styleUrls: ['./modals-container.component.scss']
})
export class ModalsContainerComponent implements OnInit {

  isShown:boolean;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.backdropVisible$().subscribe(isShown => this.isShown = isShown);
  }

}
