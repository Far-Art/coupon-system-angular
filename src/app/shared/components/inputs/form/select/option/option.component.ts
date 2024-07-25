import {Component, ElementRef, Input, Optional, Renderer2, Self} from '@angular/core';
import {ButtonComponent} from '../../../../basic/button/button.component';
import {FormGroupDirective} from '@angular/forms';
import {SelectComponent} from '../select.component';


@Component({
  selector: 'cs-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})
export class OptionComponent extends ButtonComponent {

  @Input() value: any;

  constructor(
      renderer: Renderer2,
      @Self() selfRef: ElementRef<HTMLElement>,
      @Optional() formGroup: FormGroupDirective,
      private parent: SelectComponent
  ) {super(renderer, selfRef, formGroup);}

  override ngOnInit() {
    this.role = 'option';
    this.hostClass = 'fa-option';
    this.ariaLabel = this.value ? this.value : 'empty option';
  }

  override ngOnChanges() {
    super.ngOnChanges();
    if (this.parent.selected === this) {
      this.renderer.addClass(this.selfRef.nativeElement, 'active');
    } else {
      this.renderer.removeClass(this.selfRef.nativeElement, 'active');
    }
  }

  protected override onHostFocus() {}

  protected override onHostClick() {
    if (!this.disabled) {
      this.parent.onOptionSelect(this);
    }
  }

  protected override onEscapeKey(): void {}

}
