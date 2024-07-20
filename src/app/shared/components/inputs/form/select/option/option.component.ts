import {Component, Input, TemplateRef, ViewChild} from '@angular/core';
import {ButtonComponent} from '../../../../basic/button/button.component';


@Component({
  selector: 'cs-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})
export class OptionComponent extends ButtonComponent {

  @Input() value: any;

  @ViewChild('templateRef', {static: true}) templateRef: TemplateRef<HTMLElement>;

  override ngOnInit() {}

}
