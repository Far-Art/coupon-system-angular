import {AfterViewInit, Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'cs-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, AfterViewInit {

  @Input() id: string | number;

  @Input('class') clazz: string;

  constructor() {
    this.id = this.id == null ? this.getRandomId() : this.id;
  }

  private getRandomId() {
    return Math.random().toString(36).substring(0, 4);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {

  }

}
