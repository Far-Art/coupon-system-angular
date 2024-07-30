import {Component, ViewEncapsulation} from '@angular/core';
import {ButtonComponent} from '../button/button.component';


@Component({
  selector: 'cs-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IconButtonComponent extends ButtonComponent {

}
