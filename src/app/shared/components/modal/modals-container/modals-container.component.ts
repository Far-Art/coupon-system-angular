import {Component, ElementRef, HostBinding, OnInit, Self} from '@angular/core';
import {ModalService} from '../modal.service';


@Component({
  selector: 'cs-modals-container',
  templateUrl: './modals-container.component.html',
  styleUrls: ['./modals-container.component.scss']
})
export class ModalsContainerComponent implements OnInit {

  isShown: boolean;

  @HostBinding('style.z-index') zIndex: number = -1;

  constructor(private modalService: ModalService, @Self() private elRef: ElementRef) {}

  ngOnInit(): void {
    this.modalService.backdropVisible$().subscribe(isShown => this.isShown = isShown);
    this.modalService['registerContainer'](this.elRef);
  }

}
