import {AfterViewInit, Component, ElementRef, HostBinding, Input, OnChanges, OnDestroy, OnInit, Optional, Renderer2, Self} from '@angular/core';
import {FormGroupDirective} from '@angular/forms';
import {ElementRole, HostComponent} from '../host/host.component';


@Component({
  selector: 'cs-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent extends HostComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() type: 'submit' | 'button' | 'reset' = 'button';
  @Input() showSpinner = false;
  @Input() placeholder: string;

  @HostBinding('tabindex') protected tabIndex: number = 0;

  private onEnterKeyUnsubscribe: () => void;
  private rootFormElement: HTMLElement;
  private initialFormValue: any;

  constructor(
      renderer: Renderer2,
      @Optional() protected formGroup: FormGroupDirective,
      @Self() selfRef: ElementRef<HTMLElement>
  ) {super(renderer, selfRef);}

  ngOnInit(): void {
    this.hostClass = 'position-relative ' + (this.class ? this.class : 'btn btn-primary');
  }

  ngAfterViewInit(): void {
    // ensure all fields was set
    setTimeout(() => {
      if (this.onEnterKeyUnsubscribe) this.onEnterKeyUnsubscribe();
      this.setAriaLabel();
      if (this.formGroup) {
        if (this.type === 'submit') {
          this.rootFormElement = this.getRootFormElement(this.selfRef.nativeElement);
          this.onEnterKeyUnsubscribe = this.renderer.listen(this.rootFormElement, 'keydown.enter', () => this.onHostClick());
        } else if (this.type === 'reset') {
          this.initialFormValue = this.formGroup.value;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.onEnterKeyUnsubscribe) this.onEnterKeyUnsubscribe();
  }

  protected setAriaLabel() {
    if (this.selfRef.nativeElement.ariaLabel) {
      this.ariaLabel = this.selfRef.nativeElement.ariaLabel;
      return;
    }

    switch (this.type) {
      case 'submit':
        this.ariaLabel = 'Submit';
        break;
      case 'reset':
        this.ariaLabel = 'Reset';
        break;
      default:
        this.ariaLabel = 'Close';
    }
  }

  protected override onEscapeClick(): void {
    this.selfRef.nativeElement.blur();
  }

  protected onHostFocus(): void {}

  protected override onHostClick(event?: Event): void {
    if (!this.disabled) {
      if (this.formGroup) {
        if (this.type === 'submit' && !this.formGroup.submitted) {
          if (document.hasFocus() && document.activeElement.tagName === 'TEXTAREA') {
            return;
          }
          this.formGroup.ngSubmit.emit();
        } else if (this.type === 'reset') {
          this.formGroup.form.reset(this.initialFormValue);
        }
      }
    }
  }

  private getRootFormElement(el: HTMLElement): HTMLElement {
    const parent = el.parentElement;
    if (!parent) {
      return el;
    }

    if (parent.tagName === 'BODY' || parent.tagName === 'FORM' || parent.role === 'form') {
      return parent;
    }
    return this.getRootFormElement(parent);
  }

  protected role(): ElementRole {
    return 'button';
  }
}
