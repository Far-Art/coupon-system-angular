import {Component, ElementRef, HostBinding, Input, OnChanges, OnInit, Renderer2, Self} from '@angular/core';
import {SelectComponent} from '../select.component';
import {ElementRole, HostComponent} from '../../../../basic/host/host.component';


@Component({
  selector: 'cs-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})
export class OptionComponent extends HostComponent implements OnInit, OnChanges {

  @Input() value: any;

  @HostBinding('tabindex') protected tabIndex: number = 0;

  constructor(
      renderer: Renderer2,
      private parent: SelectComponent,
      @Self() selfRef: ElementRef<HTMLElement>
  ) {super(renderer, selfRef);}

  ngOnInit() {
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

  protected role(): ElementRole {
    return 'option';
  }
}
