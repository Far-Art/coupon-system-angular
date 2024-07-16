import {Component, HostBinding, Input, OnInit, TemplateRef} from '@angular/core';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'sc-offcanvas',
  templateUrl: './off-canvas.component.html',
  styleUrls: ['./off-canvas.component.scss']
})
export class OffCanvasComponent implements OnInit {

  @Input() title = 'Menu';

  @Input() class: string;

  @HostBinding('class') hostClass: string;

  constructor(private offCanvasService: NgbOffcanvas) {}

  openEnd(content: TemplateRef<any>) {
    this.offCanvasService.open(content, {position: 'end'});
  }

  ngOnInit(): void {
    this.hostClass = this.class;
  }
}
