import {Component, Input} from '@angular/core';


@Component({
  selector: 'sc-offcanvas',
  templateUrl: './off-canvas.component.html',
  styleUrls: ['./off-canvas.component.scss']
})
export class OffCanvasComponent {

  @Input() title = 'Menu';
}
