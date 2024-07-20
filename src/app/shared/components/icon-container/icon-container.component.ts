import {Component, Input} from '@angular/core';


@Component({
  selector: 'cs-icon-container',
  templateUrl: './icon-container.component.html',
  styleUrls: ['./icon-container.component.scss']
})
export class IconContainerComponent {

  @Input() iconType: 'text' | 'textarea' | 'number' | 'currency' | 'date' | 'email' | 'password' | 'button' | 'checkbox' | 'radio' | 'range' | 'image' | 'search';

  @Input() iconValue: string | number;

}
