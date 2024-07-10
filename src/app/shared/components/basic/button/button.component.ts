import {AfterViewInit, Component, ElementRef, HostBinding, HostListener, Input, OnChanges, OnInit, Renderer2, Self} from '@angular/core';


@Component({
  selector: 'cs-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit, OnChanges, AfterViewInit {
  @Input('class') class: string;
  @Input('disabled') disabled: boolean         = false;
  @Input() type: 'submit' | 'button' | 'reset' = 'button';

  @HostBinding('class') protected hostClass: string;
  @HostBinding('role') protected role: string;
  @HostBinding('tabindex') protected tabIndex: number                = 0;
  @HostBinding('attr.aria-label') protected ariaLabel: string;
  @HostBinding('attr.aria-disabled') protected ariaDisabled: boolean = false;
  @HostBinding('disabled') protected hostDisabled: boolean;

  constructor(
      protected renderer: Renderer2,
      @Self() protected selfRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.hostClass = 'position-relative ' + (this.class ? this.class : 'btn btn-primary');
  }

  ngOnChanges(): void {
    this.setDisabled();
  }

  ngAfterViewInit(): void {
    // ensure all fields was set
    this.setDisabled();
    setTimeout(() => {
      this.setType();
      this.setAriaLabel();
    });
  }

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  protected selfClick(event: Event): void {
    event.preventDefault();
    if (!this.disabled) {
      this.selfRef.nativeElement.click();
    }
  }

  @HostListener('click', ['$event'])
  protected onClick(event: Event): void {
    event.stopPropagation();
  }

  protected setType() {
    if (this.type === 'submit') {
      this.role = 'submit';
    } else {
      this.role = 'button';
    }
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

  protected setDisabled() {
    if (this.disabled) {
      this.renderer.addClass(this.selfRef.nativeElement, 'disabled');
      this.ariaDisabled = true;
    } else {
      this.renderer.removeClass(this.selfRef.nativeElement, 'disabled');
      this.ariaDisabled = false;
    }
  }
}
