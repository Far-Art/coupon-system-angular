import {ElementRef, Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BackdropService {
  private _isBackdropVisible = new BehaviorSubject(false);
  private _onBackdropClick: Subject<MouseEvent> = new Subject();
  private renderer: Renderer2;
  private containerElement: HTMLElement;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  show(): void {
    this.showBackdropFlow();
    const tabbed = document.body.querySelectorAll('[tabindex="0"]');
    tabbed.forEach(el => this.renderer.setAttribute(el,'tabindex', '-1'));
    console.log(tabbed);
  }

  hide(): void {
    this.hideBackdropFlow();
  }

  isVisible$(): Observable<boolean> {
    return this._isBackdropVisible.asObservable();
  }

  onBackdropClick$(): Observable<MouseEvent> {
    return this._onBackdropClick.asObservable();
  }

  protected onBackdropClick(event: MouseEvent): void {
    this._onBackdropClick.next(event);
  }

  protected registerContainer(containerRef: ElementRef): void {
    this.containerElement = containerRef.nativeElement;
  }

  private showBackdropFlow() {
    this._isBackdropVisible.next(true);
    this.renderer.setStyle(document.documentElement, 'overflow-y', 'hidden');
    this.renderer.setStyle(this.containerElement, 'z-index', 1000);
  }

  private hideBackdropFlow() {
    this._isBackdropVisible.next(false);
    this.renderer.removeStyle(document.documentElement, 'overflow-y');
    this.renderer.setStyle(this.containerElement, 'z-index', -10);
  }

}
