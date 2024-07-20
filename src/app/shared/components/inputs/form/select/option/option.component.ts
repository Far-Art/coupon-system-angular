import {AfterContentInit, Component, ElementRef, HostBinding, Injector, Input, Self, TemplateRef, ViewChild} from '@angular/core';
import {ButtonComponent} from '../../../../basic/button/button.component';


@Component({
  selector: 'cs-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})
export class OptionComponent extends ButtonComponent implements AfterContentInit {

  @Input() value: any;

  @HostBinding('role') override role = 'option';

  @ViewChild('templateRef', {static: true}) templateRef: TemplateRef<HTMLElement>;

  // templateRef: TemplateRef<HTMLElement>;

  // constructor(@Self() elRef: ElementRef<HTMLElement>) {
  //   this.template = elRef.nativeElement;
  // }

  ngAfterContentInit(): void {
    //   this.template = this.templateRef;
  }

}
