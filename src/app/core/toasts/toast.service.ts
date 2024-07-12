import {Injectable, Renderer2, RendererFactory2, ViewContainerRef, ViewRef} from '@angular/core';
import {ToastComponent} from './toast.component';


export interface ToastOptions {
  message: string;
  header?: string;
  style?: 'info' | 'success' | 'warning' | 'danger';
  timeout?: number;
  dismiss?: 'auto' | 'manual';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private renderer: Renderer2;
  private container: Element;
  private viewContainerRef: ViewContainerRef;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  notify(options: ToastOptions) {
    this.appendToast(options);
  }

  dismiss(toastRef: ViewRef) {
    this.removeToast(toastRef);
  }

  private appendToast(options: ToastOptions) {
    const toast            = this.viewContainerRef.createComponent(ToastComponent);
    toast.instance.options = options;
    toast.instance.viewRef = toast.hostView;
    const toastEl          = toast.location.nativeElement;
    this.renderer.insertBefore(this.container, toastEl, this.container.firstChild);
    return toast.hostView;
  }

  private removeToast(toastRef: ViewRef) {
    const i = this.viewContainerRef.indexOf(toastRef);
    this.viewContainerRef.remove(i);
  }
}
