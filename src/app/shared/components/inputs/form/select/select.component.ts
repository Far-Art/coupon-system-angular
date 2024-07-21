import {Component, ContentChildren, forwardRef, Input, QueryList, ViewChild} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {AbstractFormInputComponent} from '../abstract-form-input.component';
import {OptionComponent} from './option/option.component';
import {Subscription} from 'rxjs';


@Component({
  selector: 'cs-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent extends AbstractFormInputComponent<any> {

  @Input() showEmptyOption = false;
  @Input('selected') selectedIndex: number;
  @ContentChildren(OptionComponent) protected _optionsQueryList: QueryList<OptionComponent>;
  @ViewChild(OptionComponent) protected _emptyOption: OptionComponent;
  protected isOpen = false;
  protected _options: OptionComponent[] = [];
  protected selected: OptionComponent;

  private subscription: Subscription;

  onOpen() {
    this.isOpen = true;
    this.backdropService.show();
    this.renderer.setStyle(this.elRef.nativeElement, 'z-index', '1050');
  }

  onClose() {
    this.isOpen = false;
    this.backdropService.hide();
    this.renderer.removeStyle(this.elRef.nativeElement, 'z-index');
  }

  onOptionSelect(index: number) {
    this.selected = this._options[index];
    this.selectedIndex = index;
    this.setValue(this.selected.value);
    this.onClose();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.subscription = this.backdropService.onBackdropClick$().subscribe(() => this.onClose());
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.subscription.unsubscribe();
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.showEmptyOption) {
      this._options.push(this._emptyOption);
    }
    this._options.push(...this._optionsQueryList);

    if (this.selectedIndex) {
      this.onOptionSelect(this.selectedIndex);
    }

    if (!this.selected && this._options.length > 0) {
      this.onOptionSelect(0);
    }

    // this.changeDetector.detectChanges();
  }

}
