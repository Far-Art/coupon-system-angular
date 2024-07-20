import {Component, HostBinding, Input} from '@angular/core';


@Component({
  selector: 'cs-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})
export class OptionComponent {

  @Input() value: any;

  @HostBinding('role') role = 'option';

}
