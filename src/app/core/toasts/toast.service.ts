import {Injectable, Renderer2, RendererFactory2, ViewContainerRef, ViewRef} from '@angular/core';
import {ToastComponent} from './toast.component';


export interface ToastOptions {
  message: string;
  header?: string;
  style?: 'info' | 'success' | 'warning' | 'danger';
  timeout?: number;
  dismiss?: 'auto' | 'manual';
}

@Injectable()
export class ToastService {

  private renderer: Renderer2;
  private container: HTMLElement;
  private viewContainerRef: ViewContainerRef;

  private readonly defaultTimeout = 5000;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  notify(options: ToastOptions) {
    this.removeToast(this.appendToast(options), options);
  }

  private appendToast(options: ToastOptions) {
    const toast            = this.viewContainerRef.createComponent(ToastComponent);
    toast.instance.options = options;
    const toastEl          = toast.location.nativeElement;
    this.renderer.insertBefore(this.container, toastEl, this.container.firstChild, true);
    return toast.hostView;
  }

  private removeToast(toastRef: ViewRef, options: ToastOptions) {
    if (options.dismiss === 'manual') {
      return;
    }
    setTimeout(() => {
      const i = this.viewContainerRef.indexOf(toastRef);
      this.viewContainerRef.remove(i);
    }, options.timeout || this.defaultTimeout);
  }
}
