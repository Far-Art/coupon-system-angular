import {Component, ElementRef, HostBinding, HostListener, Input, OnChanges, Renderer2} from '@angular/core';


export type ElementRole = 'combobox' | 'option' | 'button' | 'dialog' | 'search' | 'alert' | 'alertdialog' | 'application' | 'article' | 'banner' | 'cell' | 'columnheader' | 'complementary' | 'contentinfo' | 'definition' | 'directory' | 'document' | 'feed' | 'figure' | 'form' | 'grid' | 'gridcell' | 'group' | 'heading' | 'img' | 'link' | 'list' | 'listbox' | 'listitem' | 'main' | 'menu' | 'menubar' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'navigation' | 'none' | 'note' | 'radiogroup' | 'radio' | 'presentation' | 'progressbar' | 'region' | 'row' | 'rowgroup' | 'rowheader' | 'searchbox' | 'separator' | 'slider' | 'status' | 'switch' | 'table' | 'tab' | 'tabpanel' | 'tablist' | 'term' | 'textbox' | 'timer' | 'toolbar' | 'tooltip' | 'tree' | 'treegrid' | 'treeitem';

@Component({
  templateUrl: './host.component.html'
})
export abstract class HostComponent implements OnChanges {
  @Input('class') class: string;
  @Input('disabled') disabled: boolean = false;

  @HostBinding('class') protected hostClass: string;
  @HostBinding('disabled') protected isHostDisabled: boolean;
  @HostBinding('attr.aria-disabled') protected ariaDisabled: boolean;
  @HostBinding('attr.aria-label') protected ariaLabel: string;
  @HostBinding('role') protected _role: string = this.role() ? this.role() : undefined;

  protected constructor(protected renderer: Renderer2, protected selfRef: ElementRef<HTMLElement>) {}

  protected abstract onHostClick(event: Event): void;

  protected abstract onHostFocus(event: Event): void;

  protected abstract role(): ElementRole;

  protected onEscapeClick(event: Event) {};

  protected onEnterClick(event: Event) {
    this.selfRef.nativeElement.click();
  }

  protected onSpaceClick(event: Event) {}

  ngOnChanges(): void {
    this.setDisabled();
  }

  private setDisabled() {
    if (this.disabled) {
      this.isHostDisabled = true;
      this.renderer.addClass(this.selfRef.nativeElement, 'disabled');
      this.ariaDisabled = true;
    } else {
      this.isHostDisabled = false;
      this.renderer.removeClass(this.selfRef.nativeElement, 'disabled');
      this.ariaDisabled = false;
    }
  }

  private preventDefaultAndPropagation(event: Event) {
    if (event.cancelable) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  @HostListener('keydown.enter', ['$event'])
  private _onEnterClick(event: Event): void {
    this.preventDefaultAndPropagation(event);
    if (this.selfRef) {
      this.onEnterClick(event);
    }
  }

  @HostListener('keydown.space', ['$event'])
  private _onSpaceClick(event: Event): void {
    this.preventDefaultAndPropagation(event);
    if (this.selfRef) {
      this.onSpaceClick(event);
    }
  }

  @HostListener('keydown.escape', ['$event'])
  private _onEscape(event: Event): void {
    this.preventDefaultAndPropagation(event);
    this.onEscapeClick(event);
  }

  @HostListener('click', ['$event'])
  private _onHostClick(event: Event): void {
    this.onHostClick(event);
  }

  @HostListener('focus', ['$event'])
  private _onHostFocus(event: Event): void {
    this.onHostFocus(event);
  }

}
