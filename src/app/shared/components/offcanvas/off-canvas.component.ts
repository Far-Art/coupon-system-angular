import {Component, Input, TemplateRef} from '@angular/core';
import {NgbOffcanvas} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'sc-offcanvas',
  templateUrl: './off-canvas.component.html',
  styleUrls: ['./off-canvas.component.scss']
})
export class OffCanvasComponent {

  @Input() title = 'Menu';

  constructor(private offCanvasService: NgbOffcanvas) {}

  openEnd(content: TemplateRef<any>) {
    this.offCanvasService.open(content, {position: 'end'});
  }
}
