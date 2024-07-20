import {Component} from '@angular/core';
import {ButtonComponent} from '../button/button.component';


@Component({
  selector: 'cs-close-button',
  templateUrl: './close-button.component.html',
  styleUrls: ['./close-button.component.scss']
})
export class CloseButtonComponent extends ButtonComponent {

  override ngOnInit(): void {}

}
